import type { IDataObject } from 'n8n-workflow';

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
