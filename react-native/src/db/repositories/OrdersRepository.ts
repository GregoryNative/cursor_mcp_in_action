import SQLite, { SQLiteDatabase, SQLError, Transaction } from 'react-native-sqlite-storage';
import { IOrdersRepository } from '../../domain/repositories/IOrdersRepository';
import { Order, OrderSearchParams } from '../../domain/entities/Order';
import { OrdersApi } from '../../api/ordersApi';

const database_name = "pos-orders.db";
const database_version = "1.0";
const database_displayname = "Orders SQLite Database";
const database_size = 200000;

let dbInstance: SQLiteDatabase | null = null;

class OrdersRepository implements IOrdersRepository {
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
                CREATE TABLE IF NOT EXISTS orders (
                    id TEXT PRIMARY KEY,
                    orderNumber TEXT NOT NULL,
                    orderReferenceId TEXT NOT NULL,
                    createdAt TEXT NOT NULL,
                    createdDate TEXT NOT NULL,
                    createdTime TEXT NOT NULL,
                    soldBy TEXT NOT NULL,
                    customer TEXT NOT NULL,
                    channel TEXT NOT NULL,
                    totals TEXT NOT NULL,
                    items TEXT NOT NULL
                )
            `);
            console.log('Orders table initialized successfully');
        } catch (error) {
            console.error('Error initializing orders table:', error);
            throw error;
        }
    }

    private parseOrderRow(row: any): Order {
        return {
            id: row.id,
            orderNumber: row.orderNumber,
            orderReferenceId: row.orderReferenceId,
            createdAt: row.createdAt,
            createdDate: row.createdDate,
            createdTime: row.createdTime,
            soldBy: row.soldBy,
            customer: JSON.parse(row.customer),
            channel: row.channel,
            totals: JSON.parse(row.totals),
            items: JSON.parse(row.items)
        };
    }

    async getAll(params: OrderSearchParams): Promise<{ orders: Order[] }> {
        const { limit, offset } = params;
        const db = await this.getDb();
        const [result] = await db.executeSql(
            'SELECT * FROM orders ORDER BY createdDate DESC, createdTime DESC LIMIT ? OFFSET ?',
            [limit, offset]
        );

        const orders: Order[] = [];
        for (let i = 0; i < result.rows.length; i++) {
            orders.push(this.parseOrderRow(result.rows.item(i)));
        }

        return { orders };
    }

    async getById(id: string): Promise<Order | null> {
        const db = await this.getDb();
        const [result] = await db.executeSql('SELECT * FROM orders WHERE id = ?', [id]);

        if (result.rows.length === 0) {
            return null;
        }

        return this.parseOrderRow(result.rows.item(0));
    }

    async getByCustomerId(customerId: string): Promise<Order[]> {
        const db = await this.getDb();
        const [result] = await db.executeSql(
            'SELECT * FROM orders WHERE json_extract(customer, "$.id") = ? ORDER BY createdAt DESC',
            [customerId]
        );

        const orders: Order[] = [];
        for (let i = 0; i < result.rows.length; i++) {
            orders.push(this.parseOrderRow(result.rows.item(i)));
        }

        return orders;
    }

    async searchOrders(params: OrderSearchParams): Promise<{ orders: Order[]; total: number }> {
        const { searchText, limit, offset } = params;
        const searchQuery = searchText ? `%${searchText}%` : '%';
        const db = await this.getDb();

        const [countResult] = await db.executeSql(
            `SELECT COUNT(*) as count FROM orders 
            WHERE soldBy LIKE ? OR orderNumber LIKE ? OR orderReferenceId LIKE ?`,
            [searchQuery, searchQuery, searchQuery]
        );
        const total = countResult.rows.item(0).count;

        const [result] = await db.executeSql(
            `SELECT * FROM orders 
            WHERE soldBy LIKE ? OR orderNumber LIKE ? OR orderReferenceId LIKE ?
            ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
            [searchQuery, searchQuery, searchQuery, limit, offset]
        );

        const orders: Order[] = [];
        for (let i = 0; i < result.rows.length; i++) {
            orders.push(this.parseOrderRow(result.rows.item(i)));
        }

        return { orders, total };
    }

    async saveOrders(orders: Order[]): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const db = await this.getDb();
            
            db.transaction((tx: Transaction) => {
                orders.forEach((order) => {
                    tx.executeSql(
                        `INSERT OR REPLACE INTO orders 
                        (id, orderNumber, orderReferenceId, createdAt, createdDate, createdTime, soldBy, customer, channel, totals, items) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            order.id,
                            order.orderNumber,
                            order.orderReferenceId,
                            order.createdAt,
                            order.createdDate,
                            order.createdTime,
                            order.soldBy,
                            JSON.stringify(order.customer),
                            order.channel,
                            JSON.stringify(order.totals),
                            JSON.stringify(order.items)
                        ]
                    );
                });
            }, 
            (error: SQLError) => {
                console.error("Transaction error:", error);
                reject(error);
            },
            () => {
                console.log("All products saved successfully");
                resolve();
            });
        });
    }

    async clearOrders(): Promise<void> {
        const db = await this.getDb();
        await db.executeSql('DROP TABLE IF EXISTS orders');
        console.log('Orders cleared successfully');
    }

    async sync(): Promise<Boolean> {
        try {
            await this.initDatabase();

            const BATCH_SIZE = 2000;
            let hasMore = true;
            let currentOffset = 0;
            let totalLoaded = 0;

            while (hasMore) {
                try {
                    const { orders } = await OrdersApi.fetchOrders(BATCH_SIZE, currentOffset);

                    if (orders.length < BATCH_SIZE) {
                        hasMore = false;
                    }

                    await this.saveOrders(orders);
                    
                    totalLoaded += orders.length;
                    currentOffset += BATCH_SIZE;

                    console.log(`Synced batch of ${orders.length} orders. Total so far: ${totalLoaded}`);
                } catch (error) {
                    console.error('Error during sync batch:', error);
                    return false;
                }
            }

            console.log(`Orders sync completed successfully. Total items synced: ${totalLoaded}`);
            return true;
        } catch (error) {
            console.error('Error during orders sync:', error);
            return false;
        }
    }
}

export default new OrdersRepository(); 