import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import { ICustomersRepository } from '../../domain/repositories/ICustomersRepository';
import { Customer } from '../../domain/entities/Customer';
import { CustomersApi } from '../../api/customersApi';

const database_name = "pos-customers.db";
const database_version = "1.0";
const database_displayname = "Customers SQLite Database";
const database_size = 200000;

let dbInstance: SQLiteDatabase | null = null;

class CustomersRepository implements ICustomersRepository {
    private async getDb(): Promise<SQLiteDatabase> {
        if (dbInstance) {
            return dbInstance;
        }
        
        dbInstance = await SQLite.openDatabase(
            database_name,
            database_version,
            database_displayname,
            // @ts-ignore
            database_size,
        );
        
        return dbInstance;
    }

    private async initDatabase(): Promise<void> {
        try {
            const db = await this.getDb();
            await db.executeSql(`
                CREATE TABLE IF NOT EXISTS customers (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    lastName TEXT NOT NULL,
                    email TEXT NOT NULL,
                    phone TEXT NOT NULL,
                    avatar TEXT NOT NULL,
                    orders TEXT NOT NULL,
                    createdAt TEXT NOT NULL,
                    updatedAt TEXT NOT NULL
                )
            `);
            console.log('Customers table initialized successfully');
        } catch (error) {
            console.error('Error initializing customers table:', error);
            throw error;
        }
    }

    private serializeCustomer(customer: Customer): any[] {
        return [
            customer.id,
            customer.name,
            customer.lastName,
            customer.email,
            customer.phone,
            customer.avatar,
            JSON.stringify(customer.orders),
            customer.createdAt,
            customer.updatedAt
        ];
    }

    private deserializeCustomer(row: any): Customer {
        return {
            id: row.id,
            name: row.name,
            lastName: row.lastName,
            email: row.email,
            phone: row.phone,
            avatar: row.avatar,
            orders: JSON.parse(row.orders),
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
        };
    }

    async getAll(): Promise<Customer[]> {
        const db = await this.getDb();
        const [result] = await db.executeSql('SELECT * FROM customers');
        const customers: Customer[] = [];
        
        for (let i = 0; i < result.rows.length; i++) {
            customers.push(this.deserializeCustomer(result.rows.item(i)));
        }
        
        return customers;
    }

    async getById(id: string): Promise<Customer | null> {
        const db = await this.getDb();
        const [result] = await db.executeSql('SELECT * FROM customers WHERE id = ?', [id]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return this.deserializeCustomer(result.rows.item(0));
    }

    async getByEmail(email: string): Promise<Customer | null> {
        const db = await this.getDb();
        const [result] = await db.executeSql('SELECT * FROM customers WHERE email = ?', [email]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return this.deserializeCustomer(result.rows.item(0));
    }

    async saveCustomers(customers: Customer[]): Promise<void> {
        const db = await this.getDb();
        
        // First clear the existing customers
        await db.executeSql('DELETE FROM customers');
        
        // Then insert the new ones
        for (const customer of customers) {
            await db.executeSql(
                `INSERT INTO customers (
                    id, 
                    name, 
                    lastName, 
                    email, 
                    phone, 
                    avatar, 
                    orders,
                    createdAt,
                    updatedAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                this.serializeCustomer(customer)
            );
        }
    }

    async clearCustomers(): Promise<void> {
        const db = await this.getDb();
        await db.executeSql('DROP TABLE IF EXISTS customers');
        console.log('Customers cleared successfully');
    }

    async sync(): Promise<Boolean> {
        try {
            await this.initDatabase();

            try {
                const { customers } = await CustomersApi.fetchCustomers(1000, 0);
                
                await this.saveCustomers(customers);
                
                console.log(`Synced ${customers.length} customers successfully`);
                return true;
            } catch (error) {
                console.error('Error during customers sync:', error);
                return false;
            }
        } catch (error) {
            console.error('Error during sync:', error);
            return false;
        }
    }
}

export default new CustomersRepository(); 