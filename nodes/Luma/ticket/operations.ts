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
    UpdateTicketTypeRequest
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
     * Update an existing ticket type
     */
    static async update(
        context: LumaOperationContext
    ): Promise<INodeExecutionData> {
        const ticketTypeId = context.executeFunctions.getNodeParameter(
            'ticketTypeId',
            context.itemIndex
        ) as string;

        const updateFields = context.executeFunctions.getNodeParameter(
            'updateFields',
            context.itemIndex,
            {}
        ) as IDataObject;

        const additionalFields = context.executeFunctions.getNodeParameter(
            'additionalFields',
            context.itemIndex,
            {}
        ) as IDataObject;

        // Build the request body with required ticket_type_id
        const requestBody: UpdateTicketTypeRequest = {
            ticket_type_id: ticketTypeId
        };

        // Add optional update fields
        if (updateFields.name) {
            requestBody.name = updateFields.name as string;
        }
        if (updateFields.description) {
            requestBody.description = updateFields.description as string;
        }
        if (updateFields.price !== undefined) {
            requestBody.price = updateFields.price as number;
        }
        if (updateFields.capacity !== undefined) {
            requestBody.capacity = updateFields.capacity as number;
        }
        if (updateFields.minQuantity !== undefined) {
            requestBody.min_quantity = updateFields.minQuantity as number;
        }
        if (updateFields.maxQuantity !== undefined) {
            requestBody.max_quantity = updateFields.maxQuantity as number;
        }
        if (updateFields.saleStartAt) {
            requestBody.sale_start_at = updateFields.saleStartAt as string;
        }
        if (updateFields.saleEndAt) {
            requestBody.sale_end_at = updateFields.saleEndAt as string;
        }
        if (updateFields.isHidden !== undefined) {
            requestBody.is_hidden = updateFields.isHidden as boolean;
        }
        if (updateFields.requiresApproval !== undefined) {
            requestBody.requires_approval =
                updateFields.requiresApproval as boolean;
        }

        // Handle pricing tiers
        if (updateFields.pricingTiers) {
            const pricingTiers = updateFields.pricingTiers as IDataObject;
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
        if (updateFields.discountRules) {
            const discountRules = updateFields.discountRules as IDataObject;
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

        // Build query parameters for additional options
        const qs: IDataObject = {};
        if (additionalFields.preserveExistingSales !== undefined) {
            qs.preserve_existing_sales =
                additionalFields.preserveExistingSales as boolean;
        }
        if (additionalFields.notifyExistingBuyers !== undefined) {
            qs.notify_existing_buyers =
                additionalFields.notifyExistingBuyers as boolean;
        }
        if (additionalFields.reasonForChange) {
            qs.reason_for_change = additionalFields.reasonForChange as string;
        }

        const response = await this.executeRequest(context, {
            method: 'POST',
            url: buildLumaApiUrl(LUMA_ENDPOINTS.TICKET_TYPE_UPDATE),
            body: requestBody,
            qs: Object.keys(qs).length > 0 ? qs : undefined
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
        case 'create':
            return await TicketOperations.create(context);
        case 'get':
            return await TicketOperations.get(context);
        case 'list':
            return await TicketOperations.list(context);
        case 'update':
            return await TicketOperations.update(context);
        default:
            throw new NodeOperationError(
                context.executeFunctions.getNode(),
                `The operation "${operation}" is not supported for ticket resource!`
            );
    }
}
