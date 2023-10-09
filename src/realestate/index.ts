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

export class RealEstateCatalog {
    private baseUrl: string

    constructor (
        baseUrl: string | undefined,
    ) {
        this.baseUrl = baseUrl ?? 'https://catalog.atellix.com'
    }

    async getPropertyListings(): Promise<void> {
        return
    }

    async createPropertyListing(): Promise<void> {
        return
    }
}

