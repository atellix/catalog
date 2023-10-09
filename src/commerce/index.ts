import fetch from 'cross-fetch'

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
    payment_method?: 'atellixpay' | 'authorizenet'
    billing_address?: any,
    shipping_address?: any,
}

export interface PrepareOrderResult {
    result: string,
    error?: string,
    uuid?: string,
    payments?: PaymentRequest[],
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

export class CommerceCatalog {
    private baseUrl: string

    constructor (
        baseUrl: string | undefined,
    ) {
        this.baseUrl = baseUrl ?? 'https://catalog.atellix.com'
    }

    async prepareOrder (order: Order): Promise<PrepareOrderResult> {
        const url = this.baseUrl + '/api/catalog/order'
        var postData: any = {
            'command': 'prepare_order',
            'items': order.items,
            'payment_method': order.payment_method ?? 'atellixpay',
        }
        if ('billing_address' in order) {
            postData.billing_address = order.billing_address
        }
        if ('shipping_address' in order) {
            postData.shipping_address = order.shipping_address
        }
        return await postJson(url, postData)
    }
}

