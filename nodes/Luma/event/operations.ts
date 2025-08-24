import {
    type IDataObject,
    type INodeExecutionData,
    NodeOperationError
} from 'n8n-workflow';

import { buildLumaApiUrl, LUMA_ENDPOINTS } from '../shared/constants';

import { BaseOperations } from '../shared/operations.base';
import type { LumaOperationContext } from '../shared/contracts';

import type { EventData, EventFilters, CouponFilters } from './contracts';

// Event-specific operations

class EventOperations extends BaseOperations {
    /**
     * Get a single event by ID
     */
    static async get(
        context: LumaOperationContext
    ): Promise<INodeExecutionData> {
        const eventId = context.executeFunctions.getNodeParameter(
            'eventId',
            context.itemIndex
        ) as string;

        const additionalFields = context.executeFunctions.getNodeParameter(
            'additionalFields',
            context.itemIndex
        ) as IDataObject;

        const qs: IDataObject = {
            api_id: eventId
        };

        // Add view parameter if specified
        if (additionalFields.view) {
            qs.view = additionalFields.view as string;
        }

        const responseData = await this.executeRequest(context, {
            method: 'GET',
            url: buildLumaApiUrl(LUMA_ENDPOINTS.EVENT_GET),
            qs
        });

        return this.createReturnItem(responseData, context.itemIndex);
    }

    /**
     * Get many events from a calendar
     */
    static async getMany(
        context: LumaOperationContext
    ): Promise<INodeExecutionData[]> {
        const calendarId = context.executeFunctions.getNodeParameter(
            'calendarId',
            context.itemIndex
        ) as string;
        const additionalFields = context.executeFunctions.getNodeParameter(
            'additionalFields',
            context.itemIndex
        ) as IDataObject;

        const qs: EventFilters = {
            calendar_id: calendarId
        };

        // Apply filters from additional fields
        if (additionalFields.limit) {
            qs.limit = additionalFields.limit as number;
        }
        if (additionalFields.seriesId) {
            qs.series_id = additionalFields.seriesId as string;
        }
        if (additionalFields.eventState) {
            qs.event_state = additionalFields.eventState as string;
        }
        if (additionalFields.after) {
            qs.after = additionalFields.after as string;
        }
        if (additionalFields.before) {
            qs.before = additionalFields.before as string;
        }

        const responseData = await this.executeRequest(context, {
            method: 'GET',
            url: buildLumaApiUrl(LUMA_ENDPOINTS.CALENDAR_LIST_EVENTS),
            qs
        });

        return this.handleMultipleItems(responseData, context.itemIndex);
    }

    /**
     * Create a new event
     */
    static async create(
        context: LumaOperationContext
    ): Promise<INodeExecutionData> {
        const calendarId = context.executeFunctions.getNodeParameter(
            'calendarId',
            context.itemIndex
        ) as string;
        const eventName = context.executeFunctions.getNodeParameter(
            'eventName',
            context.itemIndex
        ) as string;
        const eventDescription = context.executeFunctions.getNodeParameter(
            'eventDescription',
            context.itemIndex
        ) as string;
        const startAt = context.executeFunctions.getNodeParameter(
            'startAt',
            context.itemIndex
        ) as string;
        const additionalFields = context.executeFunctions.getNodeParameter(
            'additionalFields',
            context.itemIndex
        ) as IDataObject;

        const body: EventData = {
            calendar_id: calendarId,
            name: eventName,
            start_at: startAt
        };

        // Add required description if provided
        if (eventDescription) {
            body.description = eventDescription;
        }

        // Add optional fields
        if (additionalFields.endAt) {
            body.end_at = additionalFields.endAt as string;
        }
        if (additionalFields.timezone) {
            body.timezone = additionalFields.timezone as string;
        }
        if (additionalFields.visibility) {
            body.visibility = additionalFields.visibility as string;
        }
        if (additionalFields.approvalRequired !== undefined) {
            body.approval_required =
                additionalFields.approvalRequired as boolean;
        }
        if (additionalFields.capacity) {
            body.capacity = additionalFields.capacity as number;
        }

        // Add location if specified
        const location = this.buildLocationObject(additionalFields);
        if (location) {
            body.location = location;
        }

        const responseData = await this.executeRequest(context, {
            method: 'POST',
            url: buildLumaApiUrl(LUMA_ENDPOINTS.EVENT_CREATE),
            body
        });

        return this.createReturnItem(responseData, context.itemIndex);
    }

    /**
     * Update an existing event
     */
    static async update(
        context: LumaOperationContext
    ): Promise<INodeExecutionData> {
        const eventId = context.executeFunctions.getNodeParameter(
            'eventId',
            context.itemIndex
        ) as string;
        const eventDescription = context.executeFunctions.getNodeParameter(
            'eventDescription',
            context.itemIndex
        ) as string;
        const additionalFields = context.executeFunctions.getNodeParameter(
            'additionalFields',
            context.itemIndex
        ) as IDataObject;

        const body: EventData = {
            event_id: eventId
        };

        // Add description if provided
        if (eventDescription) {
            body.description = eventDescription;
        }

        // Add optional fields for update
        if (additionalFields.name) {
            body.name = additionalFields.name as string;
        }
        if (additionalFields.startAt) {
            body.start_at = additionalFields.startAt as string;
        }
        if (additionalFields.endAt) {
            body.end_at = additionalFields.endAt as string;
        }
        if (additionalFields.timezone) {
            body.timezone = additionalFields.timezone as string;
        }
        if (additionalFields.visibility) {
            body.visibility = additionalFields.visibility as string;
        }
        if (additionalFields.approvalRequired !== undefined) {
            body.approval_required =
                additionalFields.approvalRequired as boolean;
        }
        if (additionalFields.capacity) {
            body.capacity = additionalFields.capacity as number;
        }
        if (additionalFields.state) {
            body.state = additionalFields.state as string;
        }

        // Add location if specified
        const location = this.buildLocationObject(additionalFields);
        if (location) {
            body.location = location;
        }

        const responseData = await this.executeRequest(context, {
            method: 'POST',
            url: buildLumaApiUrl(LUMA_ENDPOINTS.EVENT_UPDATE),
            body
        });

        return this.createReturnItem(responseData, context.itemIndex);
    }

    /**
     * List coupons for an event
     */
    static async listCoupons(
        context: LumaOperationContext
    ): Promise<INodeExecutionData[]> {
        const eventId = context.executeFunctions.getNodeParameter(
            'eventId',
            context.itemIndex
        ) as string;

        const additionalFields = context.executeFunctions.getNodeParameter(
            'additionalFields',
            context.itemIndex
        ) as IDataObject;

        const qs: CouponFilters = {
            event_id: eventId
        };

        // Apply filters from additional fields
        if (additionalFields.includeInactive !== undefined) {
            qs.include_inactive = additionalFields.includeInactive as boolean;
        }
        if (additionalFields.includeUsageStats !== undefined) {
            qs.include_usage_stats =
                additionalFields.includeUsageStats as boolean;
        }
        if (additionalFields.sortBy) {
            qs.sort_by = additionalFields.sortBy as
                | 'name'
                | 'created_at'
                | 'expires_at'
                | 'usage';
        }
        if (additionalFields.sortOrder) {
            qs.sort_order = additionalFields.sortOrder as 'asc' | 'desc';
        }

        const responseData = await this.executeRequest(context, {
            method: 'GET',
            url: buildLumaApiUrl(LUMA_ENDPOINTS.EVENT_LIST_COUPONS),
            qs
        });

        return this.handleMultipleItems(responseData, context.itemIndex);
    }

    /**
     * Delete an event
     */
    static async delete(
        context: LumaOperationContext
    ): Promise<INodeExecutionData> {
        const eventId = context.executeFunctions.getNodeParameter(
            'eventId',
            context.itemIndex
        ) as string;

        const additionalFields = context.executeFunctions.getNodeParameter(
            'additionalFields',
            context.itemIndex
        ) as IDataObject;

        const body: IDataObject = {
            event_id: eventId
        };

        // Add force parameter for hard delete if specified
        if (additionalFields.force === true) {
            body.force = true;
        }

        const responseData = await this.executeRequest(context, {
            method: 'POST',
            url: buildLumaApiUrl(LUMA_ENDPOINTS.EVENT_DELETE),
            body
        });

        return this.createReturnItem(responseData, context.itemIndex);
    }
}

export async function handleEventOperation(
    operation: string,
    context: LumaOperationContext
) {
    let result: INodeExecutionData | INodeExecutionData[];

    switch (operation) {
        case 'get':
            result = await EventOperations.get(context);
            break;
        case 'getMany':
            result = await EventOperations.getMany(context);
            break;
        case 'listCoupons':
            result = await EventOperations.listCoupons(context);
            break;
        case 'create':
            result = await EventOperations.create(context);
            break;
        case 'update':
            result = await EventOperations.update(context);
            break;
        case 'delete':
            result = await EventOperations.delete(context);
            break;
        default:
            throw new NodeOperationError(
                context.executeFunctions.getNode(),
                `The operation "${operation}" is not supported!`
            );
    }
    return result;
}
