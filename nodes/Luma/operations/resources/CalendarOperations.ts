import type { IDataObject, INodeExecutionData } from 'n8n-workflow';
import { BaseOperations } from '../shared/BaseOperations';
import { buildLumaApiUrl, LUMA_ENDPOINTS } from '../../utils/constants';
import type {
    LumaOperationContext,
    CalendarEventFilters
} from '../shared/OperationTypes';

// Calendar-specific operations

export class CalendarOperations extends BaseOperations {
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
}
