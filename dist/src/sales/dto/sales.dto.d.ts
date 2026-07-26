export declare class CreateSaleItemDto {
    productId: number;
    quantity: number;
}
export declare class CreateSaleDto {
    customerId?: number;
    paymentMethod: string;
    discountAmount?: number;
    items: CreateSaleItemDto[];
}
