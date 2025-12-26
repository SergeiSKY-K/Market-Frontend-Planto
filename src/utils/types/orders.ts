
export type OrderStatus = 'CREATED' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItemDto {
    productId: string;
    name: string;
    supplierLogin: string;
    quantity: number;
    priceAtPurchase: number;
}

export interface OrderResponseDto {
    id: string;
    userLogin: string;
    items: OrderItemDto[];
    status: OrderStatus;
    totalPrice: number;
    createdAt: string;
    paidAt?: string | null;
}

export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number; // page index
    size: number;
}

export interface CreateOrderDto {
    productQuantities: Record<string, number>;
}
