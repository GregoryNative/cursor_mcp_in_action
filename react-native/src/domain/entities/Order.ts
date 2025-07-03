export interface Order {
    id: string;
    orderNumber: string;
    orderReferenceId: string;
    createdAt: string;
    createdDate: string;
    createdTime: string;
    soldBy: string;
    customer: OrderCustomer;
    channel: string;
    totals: OrderTotals;
    items: OrderItem[];
}

export interface OrderItem {
    lineItemId: string;
    productId: string;
    image: string;
    name: string;
    price: number;
    totalPrice: number;
    quantity: number;
    descriptionLines: string[] | null;
}

export interface OrderCreated {
    date: string;
    time: string;
}

export interface OrderCustomer {
    id: string;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    avatar: string;
}

export interface OrderTotals {
    total: number;
    subtotal: number;
    discount: number;
    tax: number;
}

export interface OrderSearchParams {
    searchText?: string;
    customerId?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
    limit: number;
    offset: number;
} 