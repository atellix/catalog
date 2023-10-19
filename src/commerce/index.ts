import fetch from 'cross-fetch'
import { PublicKey } from '@solana/web3.js'
import { ListingClient, ListingQuery, ListingQueryResult, CategoryEntriesQuery, ListingEntriesResult, SearchRequest, SearchResult, decodeJsonld } from '../listing'
import { AtellixClient, CheckoutResult } from './atellix'

export interface RequestUUID {
    uuid: string,
}

export interface PaymentRequest {
    data: RequestUUID,
    method: 'atellixpay' | 'authorizenet',
    total: string,
}

export interface OrderItem {
    id: string,
    variant?: number,
    quantity?: number,
}

export interface Order {
    items: OrderItem[],
    paymentMethod?: 'atellixpay' | 'authorizenet'
    billingAddress?: any,
    shippingAddress?: any,
}

export interface PrepareOrderResult {
    result: string,
    error?: string,
    uuid?: string,
    payments?: PaymentRequest[],
}

export interface CheckoutSpec {
    order?: Order,
    payments?: PaymentRequest[],
    paymentWallet?: PublicKey,
    paymentToken?: string,
}

function postJson (url: string, jsonData: any): Promise<any> {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    const options = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(jsonData),
    }
    return new Promise((resolve, reject) => {
        fetch(url, options)
            .then(response => { return response.json() })
            .then(json => { resolve(json) })
            .catch(error => { reject(error) })
    })
}

export class CommerceCatalog extends ListingClient {
    async getListings (query: any): Promise<ListingQueryResult> {
        query.catalog = 'commerce'
        return await super.getListings(query as ListingQuery)
    }

    async getCategoryEntries (query: any): Promise<ListingEntriesResult> {
        var entries = await super.getCategoryEntries(query as CategoryEntriesQuery)
        for (var k of Object.keys(entries.owners)) {
            entries.owners[k]['merchant_data'] = await decodeJsonld(entries.owners[k].owner_jsonld, entries.owners[k].owner_url)
            delete entries.owners[k]['owner_jsonld']
        }
        return entries
    }

    async search (query: SearchRequest): Promise<SearchResult> {
        query.catalog = 'commerce'
        return await super.search(query)
    }

    async prepareOrder (order: Order): Promise<PrepareOrderResult> {
        const url = this.baseUrl + '/api/catalog/order'
        var postData: any = {
            'command': 'prepare_order',
            'items': order.items,
            'payment_method': order.paymentMethod ?? 'atellixpay',
        }
        if ('billingAddress' in order) {
            postData.billing_address = order.billingAddress
        }
        if ('shippingAddress' in order) {
            postData.shipping_address = order.shippingAddress
        }
        return await postJson(url, postData)
    }

    async checkout (spec: CheckoutSpec): Promise<CheckoutResult> {
        var payments: PaymentRequest[]
        if ('order' in spec && 'payments' in spec) {
            throw new Error('Invalid parameters: both "order" and "payments" specified')
        } else if ('order' in spec) {
            const orderResult = await this.prepareOrder(spec.order as Order)
            payments = orderResult.payments as PaymentRequest[]
        } else if ('payments' in spec) {
            payments = spec.payments as PaymentRequest[]
        } else {
            throw new Error('Invalid parameters: one of "order" or "payments" must be specified')
        }
        for (var pmt of payments) {
            if (pmt.method !== 'atellixpay') {
                throw new Error('Payment method unsupported by API: ' + pmt.method)
            }
        }
        const atxpay = new AtellixClient(this.provider, this.authUrl + '/api/checkout')
        return await atxpay.checkout(payments, spec.paymentWallet as PublicKey, spec.paymentToken as string)
    }
}

