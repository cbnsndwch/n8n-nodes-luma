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

export interface CreateTicketTypeRequest extends IDataObject {
    event_id: string;
    name: string;
    price: number; // in cents
    description?: string;
    capacity?: number;
    min_quantity?: number;
    max_quantity?: number;
    sale_start_at?: string; // ISO 8601
    sale_end_at?: string; // ISO 8601
    is_hidden?: boolean;
    requires_approval?: boolean;

    // Pricing tiers
    pricing_tiers?: Array<{
        name: string;
        price: number;
        start_at: string;
        end_at?: string;
        capacity?: number;
    }>;

    // Discount rules
    discount_rules?: Array<{
        type: 'early_bird' | 'bulk' | 'promo_code';
        value: number; // percentage or fixed amount
        min_quantity?: number;
        valid_until?: string;
    }>;
}

export interface CreateTicketTypeResponse extends IDataObject {
    ticket_type: LumaTicketType;
}

export interface TicketAnalyticsRequest extends IDataObject {
    // Option 1: Event-level analytics
    event_id?: string;

    // Option 2: Ticket type-level analytics
    ticket_type_id?: string;

    // Date filtering
    date_from?: string; // ISO 8601
    date_to?: string; // ISO 8601

    // Options
    include_refunds?: boolean;
    include_pending?: boolean;
    group_by?: 'day' | 'week' | 'month';
    metrics?: string[]; // specific metrics to include
}

export interface TicketAnalytics extends IDataObject {
    event_id: string;
    ticket_type_id?: string;
    date_from: string;
    date_to: string;

    // Overall Metrics
    total_sales: number;
    total_revenue: number;
    total_refunds: number;
    refund_amount: number;
    net_revenue: number;

    // Performance Metrics
    conversion_rate: number;
    avg_order_value: number;
    avg_quantity_per_order: number;

    // Time-based Data
    daily_sales?: Array<{
        date: string;
        sales_count: number;
        revenue: number;
    }>;

    // Ticket Type Breakdown
    by_ticket_type?: Array<{
        ticket_type_id: string;
        ticket_type_name: string;
        sales_count: number;
        revenue: number;
        percentage_of_total: number;
    }>;
}
