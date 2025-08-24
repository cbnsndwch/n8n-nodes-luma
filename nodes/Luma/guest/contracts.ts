import type { IDataObject } from 'n8n-workflow';

export interface GuestFilters extends IDataObject {
    event_api_id: string; // Required event ID
    approval_status?: 'approved' | 'pending' | 'rejected';
    attendance_status?: 'attended' | 'no_show' | 'checked_in';
    registration_status?: 'confirmed' | 'cancelled' | 'waitlisted';
    include_contact_info?: boolean;
    pagination_limit?: number;
    pagination_cursor?: string;
}

export interface GuestData extends IDataObject {
    guest_id?: string;
    event_api_id?: string;
    email?: string;
    name?: string;
    first_name?: string;
    last_name?: string;
    approval_status?: 'approved' | 'pending' | 'rejected';
    attendance_status?: 'attended' | 'no_show' | 'checked_in';
    registration_status?: 'confirmed' | 'cancelled' | 'waitlisted';
    created_at?: string;
    updated_at?: string;
}
