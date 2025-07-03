import { ProductDTO } from '../domain/dto/ProductDTO';
import { Product } from '../domain/entities/Product';
import { ProductMapper } from '../domain/mappers/ProductMapper';
import { BASE_URL } from '../constants';

export class ProductsApi {
    static async fetchProducts(limit: number, offset: number): Promise<{ products: Product[] }> {
        const response = await fetch(`${BASE_URL}/products?limit=${limit}&offset=${offset}`);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const productsDTO: ProductDTO[] = await response.json();

        return {
            products: ProductMapper.toEntities(productsDTO),
        };
    }
} 