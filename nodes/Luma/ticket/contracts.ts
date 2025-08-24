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

export interface UpdateTicketTypeRequest extends IDataObject {
    ticket_type_id: string;
    name?: string;
    description?: string;
    price?: number; // in cents
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

export interface UpdateTicketTypeResponse extends IDataObject {
    ticket_type: LumaTicketType;
}

export interface BulkUpdateTicketTypesRequest extends IDataObject {
    ticket_type_ids: string[];
    update_type: 'percentage_change' | 'fixed_change' | 'absolute_value';
    update_fields: {
        price_change?: {
            type: 'percentage' | 'fixed';
            value: number;
        };
        capacity_change?: {
            type: 'percentage' | 'fixed' | 'absolute';
            value: number;
        };
        sale_end_at?: string;
        is_hidden?: boolean;
    };
    additional_fields?: {
        skip_if_sold_out?: boolean;
        validate_before_update?: boolean;
        rollback_on_error?: boolean;
    };
}

export interface BulkUpdateResult extends IDataObject {
    ticket_type_id: string;
    success: boolean;
    error?: string;
    updated_fields?: IDataObject;
}

export interface BulkUpdateTicketTypesResponse extends IDataObject {
    results: BulkUpdateResult[];
    total_processed: number;
    successful_updates: number;
    failed_updates: number;
    errors?: string[];
}

export interface DeleteTicketTypeRequest extends IDataObject {
    ticket_type_id: string;
    force?: boolean; // allow deletion with existing sales
    archive_instead?: boolean; // soft delete
    transfer_sales_to_type_id?: string; // transfer to another type
    refund_existing_sales?: boolean;
}

export interface DeleteTicketTypeResponse extends IDataObject {
    success: boolean;
    message?: string;
    deleted_ticket_type_id: string;
    impact_analysis?: {
        existing_sales_count: number;
        total_revenue_affected: number;
        transfer_details?: {
            transferred_to_type_id: string;
            transferred_sales_count: number;
        };
        refund_details?: {
            refunded_sales_count: number;
            total_refund_amount: number;
        };
    };
}
