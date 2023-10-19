"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommerceCatalog = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const listing_1 = require("../listing");
const atellix_1 = require("./atellix");
function postJson(url, jsonData) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(jsonData),
    };
    return new Promise((resolve, reject) => {
        (0, cross_fetch_1.default)(url, options)
            .then(response => { return response.json(); })
            .then(json => { resolve(json); })
            .catch(error => { reject(error); });
    });
}
class CommerceCatalog extends listing_1.ListingClient {
    async getListings(query) {
        query.catalog = 'commerce';
        return await super.getListings(query);
    }
    async getCategoryEntries(query) {
        var entries = await super.getCategoryEntries(query);
        for (var k of Object.keys(entries.owners)) {
            entries.owners[k]['merchant_data'] = await (0, listing_1.decodeJsonld)(entries.owners[k].owner_jsonld, entries.owners[k].owner_url);
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
        const atxpay = new atellix_1.AtellixClient(this.provider, this.authUrl + '/api/checkout');
        return await atxpay.checkout(payments, spec.paymentWallet, spec.paymentToken);
    }
}
exports.CommerceCatalog = CommerceCatalog;
//# sourceMappingURL=index.js.map