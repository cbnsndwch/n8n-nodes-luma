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
    AddEventRequest,
    ImportPeopleRequest,
    PersonData,
    CalendarPeopleFilters,
    PersonTagsFilters,
    CalendarCouponsFilters
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

    /**
     * Import people to a calendar
     */
    static async importPeople(
        context: LumaOperationContext
    ): Promise<INodeExecutionData[]> {
        const calendarApiId = context.executeFunctions.getNodeParameter(
            'calendarApiId',
            context.itemIndex
        ) as string;

        const peopleData = context.executeFunctions.getNodeParameter(
            'people',
            context.itemIndex
        ) as IDataObject;

        const additionalFields = context.executeFunctions.getNodeParameter(
            'additionalFields',
            context.itemIndex
        ) as IDataObject;

        // Process people data from the fixed collection
        const people: PersonData[] = [];
        if (peopleData.person && Array.isArray(peopleData.person)) {
            for (const person of peopleData.person) {
                const personData: PersonData = {
                    email: person.email as string
                };

                if (person.name) {
                    personData.name = person.name as string;
                }

                if (person.role) {
                    personData.role = person.role as
                        | 'admin'
                        | 'member'
                        | 'follower';
                }

                if (person.tags) {
                    // Convert comma-separated tags to array
                    const tagsString = person.tags as string;
                    if (tagsString.trim()) {
                        personData.tags = tagsString
                            .split(',')
                            .map(tag => tag.trim())
                            .filter(tag => tag.length > 0);
                    }
                }

                people.push(personData);
            }
        }

        if (people.length === 0) {
            throw new NodeOperationError(
                context.executeFunctions.getNode(),
                'At least one person must be specified for import'
            );
        }

        const requestBody: ImportPeopleRequest = {
            calendar_api_id: calendarApiId,
            people
        };

        // Add optional fields from additional fields
        if (additionalFields.defaultRole) {
            requestBody.default_role = additionalFields.defaultRole as
                | 'admin'
                | 'member'
                | 'follower';
        }

        if (additionalFields.skipDuplicates !== undefined) {
            requestBody.skip_duplicates =
                additionalFields.skipDuplicates as boolean;
        }

        if (additionalFields.notifyUsers !== undefined) {
            requestBody.notify_users = additionalFields.notifyUsers as boolean;
        }

        const responseData = await this.executeRequest(context, {
            method: 'POST',
            url: buildLumaApiUrl(LUMA_ENDPOINTS.CALENDAR_IMPORT_PEOPLE),
            body: requestBody
        });

        return [this.createReturnItem(responseData, context.itemIndex)];
    }

    /**
     * List people in a calendar
     */
    static async listPeople(
        context: LumaOperationContext
    ): Promise<INodeExecutionData[]> {
        const additionalFields = context.executeFunctions.getNodeParameter(
            'additionalFields',
            context.itemIndex
        ) as IDataObject;

        const qs: CalendarPeopleFilters = {};

        // Apply optional filters from additional fields
        if (additionalFields.query) {
            qs.query = additionalFields.query as string;
        }
        if (additionalFields.membershipTierApiId) {
            qs.calendar_membership_tier_api_id =
                additionalFields.membershipTierApiId as string;
        }
        if (additionalFields.memberStatus) {
            qs.member_status = additionalFields.memberStatus as string;
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
            url: buildLumaApiUrl(LUMA_ENDPOINTS.CALENDAR_LIST_PEOPLE),
            qs
        });

        return this.handleMultipleItems(responseData, context.itemIndex);
    }

    /**
     * List person tags in a calendar
     */
    static async listPersonTags(
        context: LumaOperationContext
    ): Promise<INodeExecutionData[]> {
        const additionalFields = context.executeFunctions.getNodeParameter(
            'additionalFields',
            context.itemIndex
        ) as IDataObject;

        const qs: PersonTagsFilters = {};

        // Apply pagination parameters from additional fields
        if (additionalFields.paginationCursor) {
            qs.pagination_cursor = additionalFields.paginationCursor as string;
        }
        if (additionalFields.paginationLimit) {
            qs.pagination_limit = additionalFields.paginationLimit as number;
        }

        const responseData = await this.executeRequest(context, {
            method: 'GET',
            url: buildLumaApiUrl(LUMA_ENDPOINTS.CALENDAR_LIST_PERSON_TAGS),
            qs
        });

        return this.handleMultipleItems(responseData, context.itemIndex);
    }

    /**
     * List coupons in a calendar
     */
    static async listCoupons(
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

        const qs: CalendarCouponsFilters = {
            calendar_api_id: calendarApiId
        };

        // Apply pagination parameters from additional fields
        if (additionalFields.paginationCursor) {
            qs.pagination_cursor = additionalFields.paginationCursor as string;
        }
        if (additionalFields.paginationLimit) {
            qs.pagination_limit = additionalFields.paginationLimit as number;
        }

        const responseData = await this.executeRequest(context, {
            method: 'GET',
            url: buildLumaApiUrl(LUMA_ENDPOINTS.CALENDAR_LIST_COUPONS),
            qs
        });

        return this.handleMultipleItems(responseData, context.itemIndex);
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
        case 'importPeople':
            result = await CalendarOperations.importPeople(context);
            break;
        case 'listEvents':
            result = await CalendarOperations.listEvents(context);
            break;
        case 'listPeople':
            result = await CalendarOperations.listPeople(context);
            break;
        case 'listPersonTags':
            result = await CalendarOperations.listPersonTags(context);
            break;
        case 'listCoupons':
            result = await CalendarOperations.listCoupons(context);
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
