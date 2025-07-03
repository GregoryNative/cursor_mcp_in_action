export interface OrderDTO {
    id: string;
    orderNumber: string;
    orderReferenceId: string;
    created: OrderCreatedDTO;
    soldBy: string;
    customer: OrderCustomerDTO;
    channel: string;
    totals: OrderTotalsDTO;
    items: OrderItemDTO[];
}

export interface OrderItemDTO {
    lineItemId: string;
    productId: string;
    image: string;
    name: string;
    price: number;
    totalPrice: number;
    quantity: number;
    descriptionLines: string[] | null;
}

export interface OrderCreatedDTO {
    date: string;
    time: string;
}

export interface OrderCustomerDTO {
    id: string;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    avatar: string;
}

export interface OrderTotalsDTO {
    total: number;
    subtotal: number;
    discount: number;
    tax: number;
}

export interface OrderSearchParamsDTO {
    searchText?: string;
    customerId?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
    limit: number;
    offset: number;
} 