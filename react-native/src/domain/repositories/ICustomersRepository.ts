import { Syncable } from '../interfaces/Syncable';
import { Customer } from '../entities/Customer';

export interface ICustomersRepository extends Syncable {
    getAll(): Promise<Customer[]>;
    getById(id: string): Promise<Customer | null>;
    getByEmail(email: string): Promise<Customer | null>;
    saveCustomers(customers: Customer[]): Promise<void>;
    clearCustomers(): Promise<void>;
} 