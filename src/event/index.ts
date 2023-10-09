import fetch from 'cross-fetch'
import { IEvent } from '../record/interfaces'

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

export interface GetEventsResult {
    count: number,
    events: IEvent[],
    result: string,
    error?: string,
}

export class EventCatalog {
    private baseUrl: string

    constructor (
        baseUrl: string | undefined,
    ) {
        this.baseUrl = baseUrl ?? 'https://catalog.atellix.com'
    }

    async getEvents(): Promise<GetEventsResult> {
        return {
            result: 'ok',
            count: 0,
            events: [],
        }
    }

    async createEvent(event: IEvent): Promise<void> {
        return
    }
}

