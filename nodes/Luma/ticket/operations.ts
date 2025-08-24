import {
    type IDataObject,
    type INodeExecutionData,
    NodeOperationError
} from 'n8n-workflow';

import { buildLumaApiUrl, LUMA_ENDPOINTS } from '../shared/constants';

import { BaseOperations } from '../shared/operations.base';
import type { LumaOperationContext } from '../shared/contracts';

import type { TicketTypeFilters } from './contracts';

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
}

/**
 * Handle ticket operations based on operation type
 */
export async function handleTicketOperation(
    operation: string,
    context: LumaOperationContext
): Promise<INodeExecutionData | INodeExecutionData[]> {
    switch (operation) {
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
