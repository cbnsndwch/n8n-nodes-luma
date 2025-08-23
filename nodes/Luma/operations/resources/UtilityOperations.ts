import type { IDataObject, INodeExecutionData } from 'n8n-workflow';
import { BaseOperations } from '../shared/BaseOperations';
import { buildLumaApiUrl, LUMA_ENDPOINTS } from '../../utils/constants';
import type { LumaOperationContext } from '../shared/OperationTypes';

// Utility-specific operations

export class UtilityOperations extends BaseOperations {
    /**
     * Lookup entity by slug
     */
    static async entityLookup(
        context: LumaOperationContext
    ): Promise<INodeExecutionData> {
        const slug = context.executeFunctions.getNodeParameter(
            'slug',
            context.itemIndex
        ) as string;

        const additionalFields = context.executeFunctions.getNodeParameter(
            'additionalFields',
            context.itemIndex
        ) as IDataObject;

        const qs: IDataObject = {
            slug: slug
        };

        // Add optional entity type filter
        if (additionalFields.entityType) {
            qs.entity_type = additionalFields.entityType as string;
        }

        // Add optional include details flag
        if (additionalFields.includeDetails) {
            qs.include_details = additionalFields.includeDetails as boolean;
        }

        const responseData = await this.executeRequest(context, {
            method: 'GET',
            url: buildLumaApiUrl(LUMA_ENDPOINTS.ENTITY_LOOKUP),
            qs
        });

        return this.createReturnItem(responseData, context.itemIndex);
    }
}
