import type { IDataObject } from 'n8n-workflow';

import type { LocationData } from '../shared/contracts';

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

export interface EventCoupon extends IDataObject {
    api_id: string;
    event_api_id: string;
    name: string;
    code: string;
    description?: string;
    discount_type: 'percentage' | 'fixed_amount';
    discount_value: number;
    max_uses?: number;
    current_uses: number;
    max_uses_per_user?: number;
    starts_at?: string;
    expires_at?: string;
    is_active: boolean;
    is_public: boolean;
    created_at: string;
    updated_at: string;
}

export interface EventCouponsResponse extends IDataObject {
    coupons: EventCoupon[];
    total_count: number;
}

export interface CouponFilters extends IDataObject {
    event_id: string;
    include_inactive?: boolean;
    include_usage_stats?: boolean;
    sort_by?: 'name' | 'created_at' | 'expires_at' | 'usage';
    sort_order?: 'asc' | 'desc';
}
