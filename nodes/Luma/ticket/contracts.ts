import type { IDataObject } from 'n8n-workflow';

export interface LumaTicketType extends IDataObject {
    ticket_type_id: string;
    event_id: string;
    name: string;
    description?: string;

    // Pricing
    price: number; // in cents
    currency: string;

    // Availability
    capacity?: number; // null = unlimited
    sold_count: number;
    available_count?: number;

    // Purchase Limits
    min_quantity: number;
    max_quantity: number;

    // Sale Period
    sale_start_at?: string;
    sale_end_at?: string;

    // Configuration
    is_hidden: boolean;
    requires_approval: boolean;
    allows_waitlist: boolean;

    // Timestamps
    created_at: string;
    updated_at: string;

    // Pricing Tiers
    pricing_tiers?: Array<{
        tier_id: string;
        name: string;
        price: number;
        start_at: string;
        end_at?: string;
        capacity?: number;
        sold_count: number;
    }>;

    // Discount Rules
    discount_rules?: Array<{
        rule_id: string;
        type: 'early_bird' | 'bulk' | 'promo_code';
        name: string;
        value: number;
        value_type: 'percentage' | 'fixed';
        min_quantity?: number;
        max_uses?: number;
        used_count: number;
        valid_until?: string;
        promo_code?: string;
    }>;

    // Analytics (optional)
    analytics?: {
        total_revenue: number;
        conversion_rate: number;
        avg_purchase_quantity: number;
        peak_sales_day?: string;
        refund_count: number;
        refund_amount: number;
    };
}

export interface TicketTypeFilters extends IDataObject {
    event_id: string;
    status?: 'active' | 'hidden' | 'archived';
    include_stats?: boolean;
    include_sold_out?: boolean;
    sort_by?: 'price' | 'name' | 'created_at' | 'sales_count';
    sort_order?: 'asc' | 'desc';
}

export interface TicketTypesResponse extends IDataObject {
    ticket_types: LumaTicketType[];
    total_count: number;
    event_id: string;
}
