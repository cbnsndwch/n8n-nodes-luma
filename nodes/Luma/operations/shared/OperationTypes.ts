import type {
    IDataObject,
    IExecuteFunctions,
    IHttpRequestMethods
} from 'n8n-workflow';

// Shared operation types and interfaces

export interface LumaApiRequest {
    method: IHttpRequestMethods;
    url: string;
    qs?: IDataObject;
    body?: IDataObject;
}

export interface LumaOperationContext {
    executeFunctions: IExecuteFunctions;
    itemIndex: number;
}

export interface LocationData extends IDataObject {
    type: string;
    name?: string;
    address?: string;
    url?: string;
}

export interface EventData extends IDataObject {
    calendar_id?: string;
    event_id?: string;
    name?: string;
    description?: string;
    start_at?: string;
    end_at?: string;
    timezone?: string;
    visibility?: string;
    approval_required?: boolean;
    capacity?: number;
    location?: LocationData;
}

export interface EventFilters extends IDataObject {
    calendar_id?: string;
    limit?: number;
    series_id?: string;
    event_state?: string;
    after?: string; // pagination cursor
    before?: string; // pagination cursor
}
