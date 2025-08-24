import {
    NodeOperationError,
    type IDataObject,
    type INodeExecutionData
} from 'n8n-workflow';

import { buildLumaApiUrl, LUMA_ENDPOINTS } from '../shared/constants';

import { BaseOperations } from '../shared/operations.base';
import type { LumaOperationContext } from '../shared/contracts';

import type {
    CalendarEventFilters,
    EventLookupFilters,
    AddEventRequest
} from './contracts';

/**
 * Calendar-specific operations
 */
class CalendarOperations extends BaseOperations {
    /**
     * List events in a calendar
     */
    static async listEvents(
        context: LumaOperationContext
    ): Promise<INodeExecutionData[]> {
        const calendarApiId = context.executeFunctions.getNodeParameter(
            'calendarApiId',
            context.itemIndex
        ) as string;

        const additionalFields = context.executeFunctions.getNodeParameter(
            'additionalFields',
            context.itemIndex
        ) as IDataObject;

        const qs: CalendarEventFilters = {
            calendar_api_id: calendarApiId
        };

        // Apply optional filters from additional fields
        if (additionalFields.before) {
            qs.before = additionalFields.before as string;
        }
        if (additionalFields.after) {
            qs.after = additionalFields.after as string;
        }
        if (additionalFields.sortDirection) {
            qs.sort_direction = additionalFields.sortDirection as string;
        }
        if (additionalFields.sortColumn) {
            qs.sort_column = additionalFields.sortColumn as string;
        }
        if (additionalFields.paginationCursor) {
            qs.pagination_cursor = additionalFields.paginationCursor as string;
        }
        if (additionalFields.paginationLimit) {
            qs.pagination_limit = additionalFields.paginationLimit as number;
        }

        const responseData = await this.executeRequest(context, {
            method: 'GET',
            url: buildLumaApiUrl(LUMA_ENDPOINTS.CALENDAR_LIST_EVENTS),
            qs
        });

        return this.handleMultipleItems(responseData, context.itemIndex);
    }

    /**
     * Lookup an event in a calendar
     */
    static async lookupEvent(
        context: LumaOperationContext
    ): Promise<INodeExecutionData[]> {
        const calendarApiId = context.executeFunctions.getNodeParameter(
            'calendarApiId',
            context.itemIndex
        ) as string;

        const additionalFields = context.executeFunctions.getNodeParameter(
            'additionalFields',
            context.itemIndex
        ) as IDataObject;

        const qs: EventLookupFilters = {
            calendar_api_id: calendarApiId
        };

        // Apply optional lookup parameters from additional fields
        if (additionalFields.platform) {
            qs.platform = additionalFields.platform as string;
        }
        if (additionalFields.url) {
            qs.url = additionalFields.url as string;
        }
        if (additionalFields.eventApiId) {
            qs.event_api_id = additionalFields.eventApiId as string;
        }

        // Validate that at least one lookup parameter is provided
        if (!qs.url && !qs.event_api_id) {
            throw new NodeOperationError(
                context.executeFunctions.getNode(),
                'At least one lookup parameter (URL or Event API ID) must be provided'
            );
        }

        const responseData = await this.executeRequest(context, {
            method: 'GET',
            url: buildLumaApiUrl(LUMA_ENDPOINTS.CALENDAR_LOOKUP_EVENT),
            qs
        });

        return [this.createReturnItem(responseData, context.itemIndex)];
    }

    /**
     * Add an event to a calendar
     */
    static async addEvent(
        context: LumaOperationContext
    ): Promise<INodeExecutionData[]> {
        const calendarApiId = context.executeFunctions.getNodeParameter(
            'calendarApiId',
            context.itemIndex
        ) as string;

        const eventApiId = context.executeFunctions.getNodeParameter(
            'eventApiId',
            context.itemIndex
        ) as string;

        const additionalFields = context.executeFunctions.getNodeParameter(
            'additionalFields',
            context.itemIndex
        ) as IDataObject;

        const requestBody: AddEventRequest = {
            calendar_api_id: calendarApiId,
            event_api_id: eventApiId
        };

        // Add optional role from additional fields
        if (additionalFields.role) {
            requestBody.role = additionalFields.role as
                | 'host'
                | 'co-host'
                | 'organizer';
        }

        const responseData = await this.executeRequest(context, {
            method: 'POST',
            url: buildLumaApiUrl(LUMA_ENDPOINTS.CALENDAR_ADD_EVENT),
            body: requestBody
        });

        return [this.createReturnItem(responseData, context.itemIndex)];
    }
}

export async function handleCalendarOperation(
    operation: string,
    context: LumaOperationContext
) {
    let result: INodeExecutionData | INodeExecutionData[];

    switch (operation) {
        case 'addEvent':
            result = await CalendarOperations.addEvent(context);
            break;
        case 'listEvents':
            result = await CalendarOperations.listEvents(context);
            break;
        case 'lookupEvent':
            result = await CalendarOperations.lookupEvent(context);
            break;
        default:
            throw new NodeOperationError(
                context.executeFunctions.getNode(),
                `The operation "${operation}" is not supported for calendar resource!`
            );
    }
    return result;
}
