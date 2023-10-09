"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommerceCatalog = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
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
class CommerceCatalog {
    constructor(baseUrl) {
        this.baseUrl = baseUrl !== null && baseUrl !== void 0 ? baseUrl : 'https://catalog.atellix.com';
    }
    async prepareOrder(order) {
        var _a;
        const url = this.baseUrl + '/api/catalog/order';
        var postData = {
            'command': 'prepare_order',
            'items': order.items,
            'payment_method': (_a = order.payment_method) !== null && _a !== void 0 ? _a : 'atellixpay',
        };
        if ('billing_address' in order) {
            postData.billing_address = order.billing_address;
        }
        if ('shipping_address' in order) {
            postData.shipping_address = order.shipping_address;
        }
        return await postJson(url, postData);
    }
}
exports.CommerceCatalog = CommerceCatalog;
//# sourceMappingURL=index.js.map