export interface Customer {
    id: string;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    avatar: string;
    orders: CustomerOrder[];
    createdAt: string;
    updatedAt: string;
}

export interface CustomerOrder {
    id: string;
    orderNumber: string;
    created: {
        date: string;
        time: string;
    };
    channel: string;
    total: number;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
} 