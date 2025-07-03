import { Syncable } from '../interfaces/Syncable';
import { Product } from '../entities/Product';

export interface IProductsRepository extends Syncable {
    saveProduct: (product: Product) => Promise<void>;
    saveProducts: (products: Product[]) => Promise<void>;
    fetchProducts: (limit?: number, offset?: number) => Promise<Product[]>;
    searchProducts: (query: string, limit?: number, offset?: number) => Promise<Product[]>;
    clearProducts: () => Promise<boolean>;
    getProductsCount: () => Promise<number>;
    getProductById: (id: string) => Promise<Product | null>;
}
