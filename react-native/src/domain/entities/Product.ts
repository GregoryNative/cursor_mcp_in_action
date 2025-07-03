export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    options: Record<string, string[]>;
    sku: string;
    barcode: number;
    inventory: ProductInventory;
    createdAt: string;
    updatedAt: string;
}

export interface ProductInventory {
    status: 'in_stock' | 'out_of_stock';
    quantity: number;
} 