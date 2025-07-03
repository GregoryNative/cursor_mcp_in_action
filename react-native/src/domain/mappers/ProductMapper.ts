import { Product, ProductInventory } from '../entities/Product';
import { ProductDTO } from '../dto/ProductDTO';

export class ProductMapper {
    static toEntity(dto: ProductDTO): Product {
        return {
            id: dto.id,
            name: dto.name,
            price: dto.price,
            image: dto.image,
            options: dto.options,
            sku: dto.sku,
            barcode: dto.barcode,
            inventory: this.mapInventory(dto.inventory),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    private static mapInventory(inventory: ProductDTO['inventory']): ProductInventory {
        return {
            status: inventory.status,
            quantity: inventory.quantity
        };
    }

    static toEntities(dtos: ProductDTO[]): Product[] {
        return dtos.map(dto => this.toEntity(dto));
    }
} 