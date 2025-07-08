import { Customer, CustomerOrder } from '../entities/Customer';
import { CustomerDTO, CustomerOrderDTO } from '../dto/CustomerDTO';

export class CustomerMapper {
    static toEntity(dto: CustomerDTO): Customer {
        return {
            id: dto.id,
            name: dto.name,
            lastName: dto.lastName,
            email: dto.email,
            phone: dto.phone,
            avatar: dto.avatar,
            orders: dto.orders.map(order => this.mapOrder(order)),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    private static mapOrder(dto: CustomerOrderDTO): CustomerOrder {
        return {
            id: dto.id,
            orderNumber: dto.orderNumber,
            created: {
                date: dto.created.date,
                time: dto.created.time
            },
            channel: dto.channel,
            total: dto.total
        };
    }

    static toEntities(dtos: CustomerDTO[]): Customer[] {
        return dtos.map(dto => this.toEntity(dto));
    }
} 