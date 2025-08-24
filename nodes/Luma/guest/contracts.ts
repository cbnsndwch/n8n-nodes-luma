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

export interface GuestRegistrationData extends IDataObject {
    event_id: string; // Required event ID
    email: string; // Required email
    name: string; // Required name
    first_name?: string;
    last_name?: string;
    company?: string;
    job_title?: string;
    phone?: string;
    ticket_type_id?: string;
    auto_approve?: boolean;
    send_invite?: boolean;
    custom_message?: string;
}

export interface GuestRegistrationResponse extends IDataObject {
    guest_id: string;
    registration_status: 'confirmed' | 'pending' | 'waitlisted';
    confirmation_code?: string;
    ticket_info?: {
        ticket_type_id: string;
        ticket_type_name: string;
        price?: number;
    };
    next_steps?: string[];
    requires_approval: boolean;
}

export interface GuestUpdateData extends IDataObject {
    guest_id: string; // Required guest ID
    name?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    company?: string;
    job_title?: string;
    phone?: string;
    approval_status?: 'approved' | 'pending' | 'rejected';
    registration_status?: 'confirmed' | 'cancelled' | 'waitlisted';
    notes?: string;
    custom_fields?: Record<string, any>;
    notify_guest?: boolean;
    reason_for_change?: string;
}

export interface GuestApprovalData extends IDataObject {
    guest_id: string | string[]; // Required guest ID(s)
    send_notification?: boolean;
    approval_notes?: string;
    ticket_type_id?: string;
    custom_message?: string;
}

export interface GuestRejectionData extends IDataObject {
    guest_id: string | string[]; // Required guest ID(s)
    rejection_reason: string; // Required rejection reason
    send_notification?: boolean;
    custom_message?: string;
    allow_reapply?: boolean;
}
