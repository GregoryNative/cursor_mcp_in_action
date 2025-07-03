export interface ProductDTO {
    id: string;
    image: string;
    name: string;
    price: number;
    options: Record<string, string[]>;
    sku: string;
    barcode: number;
    inventory: {
        status: 'in_stock' | 'out_of_stock';
        quantity: number;
    };
} 