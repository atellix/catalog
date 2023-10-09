import fetch from 'cross-fetch'

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

export class EmploymentCatalog {
    private baseUrl: string

    constructor (
        baseUrl: string | undefined,
    ) {
        this.baseUrl = baseUrl ?? 'https://catalog.atellix.com'
    }

    // JobPostings

    async getJobPostings(): Promise<void> {
        return
    }

    async createJobPosting(): Promise<void> {
        return
    }

    // Resumes

    async getResumes(): Promise<void> {
        return
    }

    async createResume(): Promise<void> {
        return
    }
}

