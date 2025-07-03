import { Syncable } from '../interfaces/Syncable';
import { Order, OrderSearchParams } from '../entities/Order';

export interface IOrdersRepository extends Syncable {
    getAll(params: OrderSearchParams): Promise<{
        orders: Order[];
    }>;
    getById(id: string): Promise<Order | null>;
    getByCustomerId(customerId: string): Promise<Order[]>;
    searchOrders(params: OrderSearchParams): Promise<{
        orders: Order[];
        total: number;
    }>;
    saveOrders(orders: Order[]): Promise<void>;
    clearOrders(): Promise<void>;
} 