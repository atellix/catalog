import fetch from 'cross-fetch';
import { ListingClient, decodeJsonld } from '../listing';
import { AtellixClient } from './atellix';
function postJson(url, jsonData) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(jsonData),
    };
    return new Promise((resolve, reject) => {
        fetch(url, options)
            .then(response => { return response.json(); })
            .then(json => { resolve(json); })
            .catch(error => { reject(error); });
    });
}
export class CommerceCatalog extends ListingClient {
    async getListings(query) {
        query.catalog = 'commerce';
        return await super.getListings(query);
    }
    async getCategoryEntries(query) {
        var entries = await super.getCategoryEntries(query);
        for (var k of Object.keys(entries.owners)) {
            entries.owners[k]['merchant_data'] = await decodeJsonld(entries.owners[k].owner_jsonld, entries.owners[k].owner_url);
            delete entries.owners[k]['owner_jsonld'];
        }
        return entries;
    }
    async search(query) {
        query.catalog = 'commerce';
        return await super.search(query);
    }
    async prepareOrder(order) {
        var _a;
        const url = this.baseUrl + '/api/catalog/order';
        var postData = {
            'command': 'prepare_order',
            'items': order.items,
            'payment_method': (_a = order.paymentMethod) !== null && _a !== void 0 ? _a : 'atellixpay',
        };
        if ('billingAddress' in order) {
            postData.billing_address = order.billingAddress;
        }
        if ('shippingAddress' in order) {
            postData.shipping_address = order.shippingAddress;
        }
        return await postJson(url, postData);
    }
    async checkout(spec) {
        var payments;
        if ('order' in spec && 'payments' in spec) {
            throw new Error('Invalid parameters: both "order" and "payments" specified');
        }
        else if ('order' in spec) {
            const orderResult = await this.prepareOrder(spec.order);
            payments = orderResult.payments;
        }
        else if ('payments' in spec) {
            payments = spec.payments;
        }
        else {
            throw new Error('Invalid parameters: one of "order" or "payments" must be specified');
        }
        for (var pmt of payments) {
            if (pmt.method !== 'atellixpay') {
                throw new Error('Payment method unsupported by API: ' + pmt.method);
            }
        }
        const atxpay = new AtellixClient(this.provider, this.authUrl + '/api/checkout');
        return await atxpay.checkout(payments, spec.paymentWallet, spec.paymentToken);
    }
}
//# sourceMappingURL=index.js.map