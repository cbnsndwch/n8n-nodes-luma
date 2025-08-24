import {
    type IDataObject,
    type INodeExecutionData,
    NodeOperationError
} from 'n8n-workflow';

import { buildLumaApiUrl, LUMA_ENDPOINTS } from '../shared/constants';

import { BaseOperations } from '../shared/operations.base';
import type { LumaOperationContext } from '../shared/contracts';

import type { GuestFilters } from './contracts';

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
}

export async function handleGuestOperation(
    operation: string,
    context: LumaOperationContext
) {
    let result: INodeExecutionData | INodeExecutionData[];

    switch (operation) {
        case 'list':
            result = await GuestOperations.list(context);
            break;
        default:
            throw new NodeOperationError(
                context.executeFunctions.getNode(),
                `The operation "${operation}" is not supported!`
            );
    }
    return result;
}
