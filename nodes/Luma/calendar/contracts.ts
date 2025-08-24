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
    calendar_api_id: string;
    platform?: string; // external or luma
    url?: string; // Event URL to lookup
    event_api_id?: string; // Event API ID to lookup
}

export interface AddEventRequest extends IDataObject {
    calendar_api_id: string;
    event_api_id: string;
    role?: 'host' | 'co-host' | 'organizer';
}

export interface PersonData extends IDataObject {
    email: string;
    name?: string;
    role?: 'admin' | 'member' | 'follower';
    tags?: string[];
}

export interface ImportPeopleRequest extends IDataObject {
    calendar_api_id: string;
    people: PersonData[];
    skip_duplicates?: boolean;
    notify_users?: boolean;
    default_role?: 'admin' | 'member' | 'follower';
}

export interface ImportPeopleResult extends IDataObject {
    total_processed: number;
    successful_imports: number;
    failed_imports: number;
    duplicate_emails: number;
    errors?: Array<{
        email: string;
        error: string;
    }>;
}

export interface CalendarPeopleFilters extends IDataObject {
    query?: string; // Search over names and emails
    calendar_membership_tier_api_id?: string; // Filter by membership tier
    member_status?: string; // Filter by member status
    sort_direction?: string; // asc, desc, asc nulls last, desc nulls last
    sort_column?: string; // created_at, event_checked_in_count, event_approved_count, name, revenue_usd_cents
    pagination_cursor?: string; // For pagination
    pagination_limit?: number; // Number of items to return
}

export interface PersonTagsFilters extends IDataObject {
    pagination_cursor?: string; // For pagination
    pagination_limit?: number; // Number of items to return
}

export interface CalendarCouponsFilters extends IDataObject {
    pagination_cursor?: string; // For pagination
    pagination_limit?: number; // Number of items to return
}
