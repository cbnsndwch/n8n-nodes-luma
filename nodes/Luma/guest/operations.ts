import {
    type IDataObject,
    type INodeExecutionData,
    NodeOperationError
} from 'n8n-workflow';

import { buildLumaApiUrl, LUMA_ENDPOINTS } from '../shared/constants';

import { BaseOperations } from '../shared/operations.base';
import type { LumaOperationContext } from '../shared/contracts';

import type {
    GuestFilters,
    GuestRegistrationData,
    GuestUpdateData
} from './contracts';

// Guest-specific operations

class GuestOperations extends BaseOperations {
    /**
     * List all guests for a specific event
     */
    static async list(
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

        const qs: GuestFilters = {
            event_api_id: eventId
        };

        // Apply filters from additional fields
        if (additionalFields.approvalStatus) {
            qs.approval_status = additionalFields.approvalStatus as
                | 'approved'
                | 'pending'
                | 'rejected';
        }
        if (additionalFields.attendanceStatus) {
            qs.attendance_status = additionalFields.attendanceStatus as
                | 'attended'
                | 'no_show'
                | 'checked_in';
        }
        if (additionalFields.registrationStatus) {
            qs.registration_status = additionalFields.registrationStatus as
                | 'confirmed'
                | 'cancelled'
                | 'waitlisted';
        }
        if (additionalFields.includeContactInfo !== undefined) {
            qs.include_contact_info =
                additionalFields.includeContactInfo as boolean;
        }
        if (additionalFields.limit) {
            qs.pagination_limit = additionalFields.limit as number;
        }
        if (additionalFields.after) {
            qs.pagination_cursor = additionalFields.after as string;
        }

        const responseData = await this.executeRequest(context, {
            method: 'GET',
            url: buildLumaApiUrl(LUMA_ENDPOINTS.EVENT_GET_GUESTS),
            qs
        });

        return this.handleMultipleItems(responseData, context.itemIndex);
    }

    /**
     * Get details for a specific guest
     */
    static async get(
        context: LumaOperationContext
    ): Promise<INodeExecutionData> {
        const guestId = context.executeFunctions.getNodeParameter(
            'guestId',
            context.itemIndex
        ) as string;

        const additionalFields = context.executeFunctions.getNodeParameter(
            'additionalFields',
            context.itemIndex
        ) as IDataObject;

        const qs: IDataObject = {
            guest_id: guestId
        };

        // Apply additional fields for get operation
        if (additionalFields.includeHistory !== undefined) {
            qs.include_history = additionalFields.includeHistory as boolean;
        }
        if (additionalFields.includePersonalInfo !== undefined) {
            qs.include_personal_info =
                additionalFields.includePersonalInfo as boolean;
        }
        if (additionalFields.includeEventDetails !== undefined) {
            qs.include_event_details =
                additionalFields.includeEventDetails as boolean;
        }

        const responseData = await this.executeRequest(context, {
            method: 'GET',
            url: buildLumaApiUrl(LUMA_ENDPOINTS.GUEST_GET),
            qs
        });

        return this.createReturnItem(responseData, context.itemIndex);
    }

    /**
     * Register a guest for an event
     */
    static async register(
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

        const email = context.executeFunctions.getNodeParameter(
            'email',
            context.itemIndex
        ) as string;

        const additionalFields = context.executeFunctions.getNodeParameter(
            'additionalFields',
            context.itemIndex
        ) as IDataObject;

        const body: GuestRegistrationData = {
            event_id: eventId,
            name,
            email
        };

        // Apply optional fields from additional fields
        if (additionalFields.firstName) {
            body.first_name = additionalFields.firstName as string;
        }
        if (additionalFields.lastName) {
            body.last_name = additionalFields.lastName as string;
        }
        if (additionalFields.company) {
            body.company = additionalFields.company as string;
        }
        if (additionalFields.jobTitle) {
            body.job_title = additionalFields.jobTitle as string;
        }
        if (additionalFields.phone) {
            body.phone = additionalFields.phone as string;
        }
        if (additionalFields.ticketTypeId) {
            body.ticket_type_id = additionalFields.ticketTypeId as string;
        }
        if (additionalFields.autoApprove !== undefined) {
            body.auto_approve = additionalFields.autoApprove as boolean;
        }
        if (additionalFields.sendInvite !== undefined) {
            body.send_invite = additionalFields.sendInvite as boolean;
        }
        if (additionalFields.customMessage) {
            body.custom_message = additionalFields.customMessage as string;
        }

        const responseData = await this.executeRequest(context, {
            method: 'POST',
            url: buildLumaApiUrl(LUMA_ENDPOINTS.EVENT_ADD_GUESTS),
            body
        });

        return this.createReturnItem(responseData, context.itemIndex);
    }

    /**
     * Update guest information
     */
    static async update(
        context: LumaOperationContext
    ): Promise<INodeExecutionData> {
        const guestId = context.executeFunctions.getNodeParameter(
            'guestId',
            context.itemIndex
        ) as string;

        const updateFields = context.executeFunctions.getNodeParameter(
            'updateFields',
            context.itemIndex
        ) as IDataObject;

        const additionalFields = context.executeFunctions.getNodeParameter(
            'additionalFields',
            context.itemIndex
        ) as IDataObject;

        const body: GuestUpdateData = {
            guest_id: guestId
        };

        // Apply update fields
        if (updateFields.name) {
            body.name = updateFields.name as string;
        }
        if (updateFields.email) {
            body.email = updateFields.email as string;
        }
        if (updateFields.firstName) {
            body.first_name = updateFields.firstName as string;
        }
        if (updateFields.lastName) {
            body.last_name = updateFields.lastName as string;
        }
        if (updateFields.company) {
            body.company = updateFields.company as string;
        }
        if (updateFields.jobTitle) {
            body.job_title = updateFields.jobTitle as string;
        }
        if (updateFields.phone) {
            body.phone = updateFields.phone as string;
        }
        if (updateFields.approvalStatus) {
            body.approval_status = updateFields.approvalStatus as
                | 'approved'
                | 'pending'
                | 'rejected';
        }
        if (updateFields.registrationStatus) {
            body.registration_status = updateFields.registrationStatus as
                | 'confirmed'
                | 'cancelled'
                | 'waitlisted';
        }
        if (updateFields.notes) {
            body.notes = updateFields.notes as string;
        }
        if (updateFields.customFields) {
            // Convert fixedCollection format to Record<string, any>
            const customFieldsCollection =
                updateFields.customFields as IDataObject;
            if (
                customFieldsCollection.customField &&
                Array.isArray(customFieldsCollection.customField)
            ) {
                const customFields: Record<string, any> = {};
                customFieldsCollection.customField.forEach((field: any) => {
                    if (field.name && field.value !== undefined) {
                        customFields[field.name] = field.value;
                    }
                });
                body.custom_fields = customFields;
            }
        }

        // Apply additional fields
        if (additionalFields.notifyGuest !== undefined) {
            body.notify_guest = additionalFields.notifyGuest as boolean;
        }
        if (additionalFields.reasonForChange) {
            body.reason_for_change = additionalFields.reasonForChange as string;
        }

        const responseData = await this.executeRequest(context, {
            method: 'POST',
            url: buildLumaApiUrl(LUMA_ENDPOINTS.UPDATE_GUEST_STATUS),
            body
        });

        return this.createReturnItem(responseData, context.itemIndex);
    }
}

export async function handleGuestOperation(
    operation: string,
    context: LumaOperationContext
) {
    let result: INodeExecutionData | INodeExecutionData[];

    switch (operation) {
        case 'get':
            result = await GuestOperations.get(context);
            break;
        case 'list':
            result = await GuestOperations.list(context);
            break;
        case 'register':
            result = await GuestOperations.register(context);
            break;
        case 'update':
            result = await GuestOperations.update(context);
            break;
        default:
            throw new NodeOperationError(
                context.executeFunctions.getNode(),
                `The operation "${operation}" is not supported!`
            );
    }
    return result;
}
