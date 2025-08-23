import type { IDataObject, INodeExecutionData } from 'n8n-workflow';
import { BaseOperations } from '../shared/BaseOperations';
import type {
    LumaOperationContext,
    EventData,
    EventFilters
} from '../shared/OperationTypes';

// Event-specific operations

export class EventOperations extends BaseOperations {
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
            event_id: eventId
        };

        // Add view parameter if specified
        if (additionalFields.view) {
            qs.view = additionalFields.view as string;
        }

        const responseData = await this.executeRequest(context, {
            method: 'GET',
            url: 'https://api.lu.ma/public/v1/event/get',
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
            url: 'https://api.lu.ma/public/v1/calendar/list-events',
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
            url: 'https://api.lu.ma/public/v1/event/create',
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
            url: 'https://api.lu.ma/public/v1/event/update',
            body
        });

        return this.createReturnItem(responseData, context.itemIndex);
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

        const responseData = await this.executeRequest(context, {
            method: 'POST',
            url: 'https://api.lu.ma/public/v1/event/delete',
            body: {
                event_id: eventId
            }
        });

        return this.createReturnItem(responseData, context.itemIndex);
    }
}
