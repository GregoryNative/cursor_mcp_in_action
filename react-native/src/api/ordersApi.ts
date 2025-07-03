import { OrderDTO } from '../domain/dto/OrderDTO';
import { Order, OrderSearchParams } from '../domain/entities/Order';
import { OrderMapper } from '../domain/mappers/OrderMapper';
import { BASE_URL } from '../constants';

export class OrdersApi {
    static async fetchOrders(limit: number, offset: number): Promise<{ orders: Order[] }> {
        const response = await fetch(`${BASE_URL}/orders?limit=${limit}&offset=${offset}`);
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }

        const ordersDTO: OrderDTO[] = await response.json();
        return {
            orders: OrderMapper.toEntities(ordersDTO),
        };
    }
} 