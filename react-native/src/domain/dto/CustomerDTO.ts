export interface CustomerDTO {
    id: string;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    avatar: string;
    orders: CustomerOrderDTO[];
}

export interface CustomerOrderDTO {
    id: string;
    orderNumber: string;
    created: {
        date: string;
        time: string;
    };
    channel: string;
    total: number;
} 