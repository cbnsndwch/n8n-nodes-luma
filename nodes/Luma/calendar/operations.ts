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
    CreateCalendarCouponRequest,
    UpdateCalendarCouponRequest
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
     * Create a coupon for calendar events
     */
    static async createCoupon(
        context: LumaOperationContext
    ): Promise<INodeExecutionData[]> {
        const name = context.executeFunctions.getNodeParameter(
            'name',
            context.itemIndex
        ) as string;

        const code = context.executeFunctions.getNodeParameter(
            'code',
            context.itemIndex
        ) as string;

        const discountType = context.executeFunctions.getNodeParameter(
            'discountType',
            context.itemIndex
        ) as 'percentage' | 'fixed_amount';

        const discountValue = context.executeFunctions.getNodeParameter(
            'discountValue',
            context.itemIndex
        ) as number;

        const additionalFields = context.executeFunctions.getNodeParameter(
            'additionalFields',
            context.itemIndex
        ) as IDataObject;

        const requestBody: CreateCalendarCouponRequest = {
            name,
            code,
            discount_type: discountType,
            discount_value: discountValue
        };

        // Add optional fields from additional fields
        if (additionalFields.maxUses !== undefined) {
            requestBody.max_uses = additionalFields.maxUses as number;
        }
        if (additionalFields.expiresAt) {
            requestBody.expires_at = additionalFields.expiresAt as string;
        }
        if (additionalFields.description) {
            requestBody.description = additionalFields.description as string;
        }
        if (additionalFields.isActive !== undefined) {
            requestBody.is_active = additionalFields.isActive as boolean;
        }

        const responseData = await this.executeRequest(context, {
            method: 'POST',
            url: buildLumaApiUrl(LUMA_ENDPOINTS.CALENDAR_CREATE_COUPON),
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
     * Update a calendar coupon
     */
    static async updateCoupon(
        context: LumaOperationContext
    ): Promise<INodeExecutionData[]> {
        const apiId = context.executeFunctions.getNodeParameter(
            'apiId',
            context.itemIndex
        ) as string;

        const updateFields = context.executeFunctions.getNodeParameter(
            'updateFields',
            context.itemIndex
        ) as IDataObject;

        const requestBody: UpdateCalendarCouponRequest = {
            api_id: apiId
        };

        // Apply optional update fields
        if (updateFields.name) {
            requestBody.name = updateFields.name as string;
        }
        if (updateFields.code) {
            requestBody.code = updateFields.code as string;
        }
        if (updateFields.discountType) {
            requestBody.discount_type = updateFields.discountType as
                | 'percentage'
                | 'fixed_amount';
        }
        if (updateFields.discountValue !== undefined) {
            requestBody.discount_value = updateFields.discountValue as number;
        }
        if (updateFields.maxUses !== undefined) {
            requestBody.max_uses = updateFields.maxUses as number;
        }
        if (updateFields.expiresAt) {
            requestBody.expires_at = updateFields.expiresAt as string;
        }
        if (updateFields.description) {
            requestBody.description = updateFields.description as string;
        }
        if (updateFields.isActive !== undefined) {
            requestBody.is_active = updateFields.isActive as boolean;
        }

        const responseData = await this.executeRequest(context, {
            method: 'POST',
            url: buildLumaApiUrl(LUMA_ENDPOINTS.CALENDAR_UPDATE_COUPON),
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
        case 'createCoupon':
            result = await CalendarOperations.createCoupon(context);
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
        case 'lookupEvent':
            result = await CalendarOperations.lookupEvent(context);
            break;
        case 'updateCoupon':
            result = await CalendarOperations.updateCoupon(context);
            break;
        default:
            throw new NodeOperationError(
                context.executeFunctions.getNode(),
                `The operation "${operation}" is not supported for calendar resource!`
            );
    }
    return result;
}
