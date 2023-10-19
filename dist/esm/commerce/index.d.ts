import { PublicKey } from '@solana/web3.js';
import { ListingClient, ListingQueryResult, ListingEntriesResult, SearchRequest, SearchResult } from '../listing';
import { CheckoutResult } from './atellix';
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
    paymentMethod?: 'atellixpay' | 'authorizenet';
    billingAddress?: any;
    shippingAddress?: any;
}
export interface PrepareOrderResult {
    result: string;
    error?: string;
    uuid?: string;
    payments?: PaymentRequest[];
}
export interface CheckoutSpec {
    order?: Order;
    payments?: PaymentRequest[];
    paymentWallet?: PublicKey;
    paymentToken?: string;
}
export declare class CommerceCatalog extends ListingClient {
    getListings(query: any): Promise<ListingQueryResult>;
    getCategoryEntries(query: any): Promise<ListingEntriesResult>;
    search(query: SearchRequest): Promise<SearchResult>;
    prepareOrder(order: Order): Promise<PrepareOrderResult>;
    checkout(spec: CheckoutSpec): Promise<CheckoutResult>;
}
//# sourceMappingURL=index.d.ts.map