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

export interface DeletePersonTagRequest extends IDataObject {
    api_id: string; // Required - ID of tag to delete
    force_delete?: boolean; // Optional - force deletion even if tag is assigned to people
}

export interface DeletePersonTagResponse extends IDataObject {
    success: boolean;
    message?: string;
    deleted_tag?: {
        api_id: string;
        name: string;
        person_count: number; // Number of people who had this tag
    };
}

export interface CreatePersonTagRequest extends IDataObject {
    calendar_api_id: string; // Required
    name: string; // Required
    color?: string; // Optional hex color code
    description?: string; // Optional description
}

export interface CreatePersonTagResponse extends IDataObject {
    api_id: string;
    name: string;
    color?: string;
    description?: string;
    person_count: number; // Initially 0
    created_at: string; // ISO 8601
    updated_at: string; // ISO 8601
}

export interface UpdateCalendarCouponRequest extends IDataObject {
    api_id: string; // Required - ID of coupon to update
    name?: string; // Optional - new display name
    code?: string; // Optional - new coupon code
    discount_type?: 'percentage' | 'fixed_amount'; // Optional - new discount type
    discount_value?: number; // Optional - new discount value
    max_uses?: number; // Optional - new maximum uses (null = unlimited)
    expires_at?: string; // Optional - new expiration date (ISO 8601)
    description?: string; // Optional - new description
    is_active?: boolean; // Optional - activate/deactivate coupon
}
export interface CreateCalendarCouponRequest extends IDataObject {
    name: string; // Required - display name for coupon
    code: string; // Required - unique coupon code for users
    discount_type: 'percentage' | 'fixed_amount'; // Required
    discount_value: number; // Required - percentage (0-100) or cents for fixed
    max_uses?: number; // Optional - maximum uses (null = unlimited)
    expires_at?: string; // Optional - ISO 8601 expiration date
    description?: string; // Optional description
    is_active?: boolean; // Optional - default true
}

export interface CalendarCoupon extends IDataObject {
    api_id: string;
    name: string;
    code: string;
    discount_type: 'percentage' | 'fixed_amount';
    discount_value: number;
    max_uses?: number;
    current_uses: number;
    expires_at?: string;
    is_active: boolean;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface UpdatePersonTagRequest extends IDataObject {
    api_id: string; // Required - ID of tag to update
    name?: string; // Optional - new name
    color?: string; // Optional - new hex color code
    description?: string; // Optional - new description
}

export interface UpdatePersonTagResponse extends IDataObject {
    api_id: string;
    name: string;
    color?: string;
    description?: string;
    person_count: number; // Current number of people with this tag
    created_at: string; // ISO 8601
    updated_at: string; // ISO 8601 (updated timestamp)
}
