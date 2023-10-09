"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmploymentCatalog = void 0;
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
class EmploymentCatalog {
    constructor(baseUrl) {
        this.baseUrl = baseUrl !== null && baseUrl !== void 0 ? baseUrl : 'https://catalog.atellix.com';
    }
    // JobPostings
    async getJobPostings() {
        return;
    }
    async createJobPosting() {
        return;
    }
    // Resumes
    async getResumes() {
        return;
    }
    async createResume() {
        return;
    }
}
exports.EmploymentCatalog = EmploymentCatalog;
//# sourceMappingURL=index.js.map