import { Order, OrderItem, OrderCreated, OrderTotals, OrderCustomer } from '../entities/Order';
import { OrderDTO, OrderItemDTO, OrderCreatedDTO, OrderTotalsDTO, OrderCustomerDTO } from '../dto/OrderDTO';

export class OrderMapper {
    static toEntity(dto: OrderDTO): Order {
        const createdAt = new Date(`${dto.created.date}T${dto.created.time}`).toISOString();
        return {
            id: dto.id,
            orderNumber: dto.orderNumber,
            orderReferenceId: dto.orderReferenceId,
            createdAt: createdAt,
            createdDate: dto.created.date,
            createdTime: dto.created.time,
            soldBy: dto.soldBy,
            channel: dto.channel,
            customer: this.mapCustomer(dto.customer),
            totals: this.mapTotals(dto.totals),
            items: dto.items.map(item => this.mapOrderItem(item))
        };
    }

    private static mapCustomer(dto: OrderCustomerDTO): OrderCustomer {
        return {
            id: dto.id,
            name: dto.name,
            lastName: dto.lastName,
            email: dto.email,
            phone: dto.phone,
            avatar: dto.avatar,
        };
    }

    private static mapTotals(dto: OrderTotalsDTO): OrderTotals {
        return {
            total: dto.total,
            subtotal: dto.subtotal,
            discount: dto.discount,
            tax: dto.tax
        };
    }

    private static mapOrderItem(dto: OrderItemDTO): OrderItem {
        return {
            lineItemId: dto.lineItemId,
            productId: dto.productId,
            image: dto.image,
            name: dto.name,
            price: dto.price,
            totalPrice: dto.totalPrice,
            quantity: dto.quantity,
            descriptionLines: dto.descriptionLines
        };
    }

    static toEntities(dtos: OrderDTO[]): Order[] {
        return dtos.map(dto => this.toEntity(dto));
    }
} 