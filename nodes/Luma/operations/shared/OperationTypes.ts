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
    state?: string;
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

export interface UserData extends IDataObject {
    api_id?: string;
    name?: string;
    email?: string;
    username?: string;
    avatar_url?: string;
    timezone?: string;
    created_at?: string;
    updated_at?: string;
    plan_type?: string;
    is_verified?: boolean;
    is_active?: boolean;
    permissions?: {
        can_create_events?: boolean;
        can_create_calendars?: boolean;
        can_manage_coupons?: boolean;
    };
}
