import type { IDataObject } from 'n8n-workflow';

export interface CalendarEventFilters extends IDataObject {
    calendar_api_id?: string;
    before?: string; // ISO 8601 datetime filter
    after?: string; // ISO 8601 datetime filter
    sort_direction?: string; // asc, desc, asc nulls last, desc nulls last
    sort_column?: string; // start_at
    pagination_cursor?: string; // For pagination
    pagination_limit?: number; // Number of items to return
}

export interface EventLookupFilters extends IDataObject {
    calendar_api_id?: string;
    platform?: string; // external or luma
    url?: string; // Event URL to lookup
    event_api_id?: string; // Event API ID to lookup
}
