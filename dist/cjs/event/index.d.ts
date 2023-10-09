import { IEvent } from '../record/interfaces';
export interface GetEventsResult {
    count: number;
    events: IEvent[];
    result: string;
    error?: string;
}
export declare class EventCatalog {
    private baseUrl;
    constructor(baseUrl: string | undefined);
    getEvents(): Promise<GetEventsResult>;
    createEvent(event: IEvent): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map