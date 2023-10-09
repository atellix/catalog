export interface RequestUUID {
    uuid: string;
}
export interface PaymentRequest {
    data: RequestUUID;
    method: 'atellixpay' | 'authorizenet';
    total: string;
}
export interface OrderItem {
    id: string;
    variant?: number;
    quantity?: number;
}
export interface Order {
    items: OrderItem[];
    payment_method?: 'atellixpay' | 'authorizenet';
    billing_address?: any;
    shipping_address?: any;
}
export interface PrepareOrderResult {
    result: string;
    error?: string;
    uuid?: string;
    payments?: PaymentRequest[];
}
export declare class CommerceCatalog {
    private baseUrl;
    constructor(baseUrl: string | undefined);
    prepareOrder(order: Order): Promise<PrepareOrderResult>;
}
//# sourceMappingURL=index.d.ts.map