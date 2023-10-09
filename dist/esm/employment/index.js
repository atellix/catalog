import fetch from 'cross-fetch';
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
export class EmploymentCatalog {
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
//# sourceMappingURL=index.js.map