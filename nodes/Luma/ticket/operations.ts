import {
    type IDataObject,
    type INodeExecutionData,
    NodeOperationError
} from 'n8n-workflow';

import { buildLumaApiUrl, LUMA_ENDPOINTS } from '../shared/constants';

import { BaseOperations } from '../shared/operations.base';
import type { LumaOperationContext } from '../shared/contracts';

import type {
    TicketTypeFilters,
    CreateTicketTypeRequest,
    TicketAnalyticsRequest
} from './contracts';

// Ticket-specific operations

class TicketOperations extends BaseOperations {
    /**
     * List ticket types for an event
     */
    static async list(
        context: LumaOperationContext
    ): Promise<INodeExecutionData> {
        const eventId = context.executeFunctions.getNodeParameter(
            'eventId',
            context.itemIndex
        ) as string;

        const additionalFields = context.executeFunctions.getNodeParameter(
            'additionalFields',
            context.itemIndex,
            {}
        ) as IDataObject;

        // Build filters
        const filters: TicketTypeFilters = {
            event_id: eventId,
            ...additionalFields
        };

        // Remove undefined values
        Object.keys(filters).forEach(key => {
            if (
                filters[key as keyof TicketTypeFilters] === undefined ||
                filters[key as keyof TicketTypeFilters] === ''
            ) {
                delete filters[key as keyof TicketTypeFilters];
            }
        });

        const url = buildLumaApiUrl('public/v1/event/ticket-types/list');

        const response = await this.executeRequest(context, {
            method: 'GET',
            url,
            qs: filters
        });

        return {
            json: response,
            pairedItem: {
                item: context.itemIndex
            }
        };
    }

    /**
     * Get details for a specific ticket type
     */
    static async get(
        context: LumaOperationContext
    ): Promise<INodeExecutionData> {
        const ticketTypeId = context.executeFunctions.getNodeParameter(
            'ticketTypeId',
            context.itemIndex
        ) as string;

        const additionalFields = context.executeFunctions.getNodeParameter(
            'additionalFields',
            context.itemIndex,
            {}
        ) as IDataObject;

        // Build query parameters
        const qs: IDataObject = {
            ticket_type_id: ticketTypeId
        };

        // Apply additional fields for get operation
        if (additionalFields.includeAnalytics !== undefined) {
            qs.include_analytics = additionalFields.includeAnalytics as boolean;
        }
        if (additionalFields.includePricingHistory !== undefined) {
            qs.include_pricing_history =
                additionalFields.includePricingHistory as boolean;
        }
        if (additionalFields.includeDiscountRules !== undefined) {
            qs.include_discount_rules =
                additionalFields.includeDiscountRules as boolean;
        }

        const response = await this.executeRequest(context, {
            method: 'GET',
            url: buildLumaApiUrl(LUMA_ENDPOINTS.TICKET_TYPE_GET),
            qs
        });

        return {
            json: response,
            pairedItem: {
                item: context.itemIndex
            }
        };
    }

    /**
     * Create a new ticket type
     */
    static async create(
        context: LumaOperationContext
    ): Promise<INodeExecutionData> {
        const eventId = context.executeFunctions.getNodeParameter(
            'eventId',
            context.itemIndex
        ) as string;

        const name = context.executeFunctions.getNodeParameter(
            'name',
            context.itemIndex
        ) as string;

        const price = context.executeFunctions.getNodeParameter(
            'price',
            context.itemIndex
        ) as number;

        const additionalFields = context.executeFunctions.getNodeParameter(
            'additionalFields',
            context.itemIndex,
            {}
        ) as IDataObject;

        // Build the request body
        const requestBody: CreateTicketTypeRequest = {
            event_id: eventId,
            name,
            price
        };

        // Add optional fields
        if (additionalFields.description) {
            requestBody.description = additionalFields.description as string;
        }
        if (additionalFields.capacity !== undefined) {
            requestBody.capacity = additionalFields.capacity as number;
        }
        if (additionalFields.minQuantity !== undefined) {
            requestBody.min_quantity = additionalFields.minQuantity as number;
        }
        if (additionalFields.maxQuantity !== undefined) {
            requestBody.max_quantity = additionalFields.maxQuantity as number;
        }
        if (additionalFields.saleStartAt) {
            requestBody.sale_start_at = additionalFields.saleStartAt as string;
        }
        if (additionalFields.saleEndAt) {
            requestBody.sale_end_at = additionalFields.saleEndAt as string;
        }
        if (additionalFields.isHidden !== undefined) {
            requestBody.is_hidden = additionalFields.isHidden as boolean;
        }
        if (additionalFields.requiresApproval !== undefined) {
            requestBody.requires_approval =
                additionalFields.requiresApproval as boolean;
        }

        // Handle pricing tiers
        if (additionalFields.pricingTiers) {
            const pricingTiers = additionalFields.pricingTiers as IDataObject;
            if (pricingTiers.tier && Array.isArray(pricingTiers.tier)) {
                requestBody.pricing_tiers = (
                    pricingTiers.tier as IDataObject[]
                ).map(tier => {
                    if (
                        tier.name == null ||
                        tier.price == null ||
                        tier.startAt == null
                    ) {
                        throw new NodeOperationError(
                            context.executeFunctions.getNode(),
                            'Each pricing tier must have a name, price, and startAt defined.'
                        );
                    }
                    return {
                        name: tier.name as string,
                        price: tier.price as number,
                        start_at: tier.startAt as string,
                        end_at: tier.endAt as string,
                        capacity: tier.capacity as number
                    };
                });
            }
        }

        // Handle discount rules
        if (additionalFields.discountRules) {
            const discountRules = additionalFields.discountRules as IDataObject;
            if (discountRules.rule && Array.isArray(discountRules.rule)) {
                requestBody.discount_rules = (
                    discountRules.rule as IDataObject[]
                ).map(rule => ({
                    type: rule.type as 'early_bird' | 'bulk' | 'promo_code',
                    value: rule.value as number,
                    min_quantity: rule.minQuantity as number,
                    valid_until: rule.validUntil as string
                }));
            }
        }

        const response = await this.executeRequest(context, {
            method: 'POST',
            url: buildLumaApiUrl(LUMA_ENDPOINTS.TICKET_TYPE_CREATE),
            body: requestBody
        });

        return {
            json: response,
            pairedItem: {
                item: context.itemIndex
            }
        };
    }

    /**
     * Get analytics for event or ticket type
     */
    static async analytics(
        context: LumaOperationContext
    ): Promise<INodeExecutionData> {
        const eventId = context.executeFunctions.getNodeParameter(
            'eventId',
            context.itemIndex
        ) as string;

        const ticketTypeId = context.executeFunctions.getNodeParameter(
            'ticketTypeId',
            context.itemIndex
        ) as string;

        const additionalFields = context.executeFunctions.getNodeParameter(
            'additionalFields',
            context.itemIndex,
            {}
        ) as IDataObject;

        // Validate that either eventId or ticketTypeId is provided
        if (!eventId && !ticketTypeId) {
            throw new NodeOperationError(
                context.executeFunctions.getNode(),
                'Either Event ID or Ticket Type ID must be provided for analytics'
            );
        }

        if (eventId && ticketTypeId) {
            throw new NodeOperationError(
                context.executeFunctions.getNode(),
                'Please provide either Event ID or Ticket Type ID, not both'
            );
        }

        // Build query parameters
        const qs: TicketAnalyticsRequest = {};

        if (eventId) {
            qs.event_id = eventId;
        }
        if (ticketTypeId) {
            qs.ticket_type_id = ticketTypeId;
        }

        // Apply additional fields
        if (additionalFields.dateFrom) {
            qs.date_from = additionalFields.dateFrom as string;
        }
        if (additionalFields.dateTo) {
            qs.date_to = additionalFields.dateTo as string;
        }
        if (additionalFields.includeRefunds !== undefined) {
            qs.include_refunds = additionalFields.includeRefunds as boolean;
        }
        if (additionalFields.includePending !== undefined) {
            qs.include_pending = additionalFields.includePending as boolean;
        }
        if (additionalFields.groupBy) {
            qs.group_by = additionalFields.groupBy as 'day' | 'week' | 'month';
        }
        if (
            additionalFields.metrics &&
            Array.isArray(additionalFields.metrics)
        ) {
            qs.metrics = additionalFields.metrics as string[];
        }

        // Remove undefined values
        Object.keys(qs).forEach(key => {
            if (
                qs[key as keyof TicketAnalyticsRequest] === undefined ||
                qs[key as keyof TicketAnalyticsRequest] === ''
            ) {
                delete qs[key as keyof TicketAnalyticsRequest];
            }
        });

        const response = await this.executeRequest(context, {
            method: 'GET',
            url: buildLumaApiUrl(LUMA_ENDPOINTS.TICKET_ANALYTICS),
            qs
        });

        return {
            json: response,
            pairedItem: {
                item: context.itemIndex
            }
        };
    }
}

/**
 * Handle ticket operations based on operation type
 */
export async function handleTicketOperation(
    operation: string,
    context: LumaOperationContext
): Promise<INodeExecutionData | INodeExecutionData[]> {
    switch (operation) {
        case 'analytics':
            return await TicketOperations.analytics(context);
        case 'create':
            return await TicketOperations.create(context);
        case 'get':
            return await TicketOperations.get(context);
        case 'list':
            return await TicketOperations.list(context);
        default:
            throw new NodeOperationError(
                context.executeFunctions.getNode(),
                `The operation "${operation}" is not supported for ticket resource!`
            );
    }
}
