import type { INodeExecutionData } from 'n8n-workflow';
import { BaseOperations } from '../shared/BaseOperations';
import { buildLumaApiUrl, LUMA_ENDPOINTS } from '../../utils/constants';
import type { LumaOperationContext } from '../shared/OperationTypes';

// User-specific operations

export class UserOperations extends BaseOperations {
    /**
     * Get authenticated user information
     */
    static async getSelf(
        context: LumaOperationContext
    ): Promise<INodeExecutionData> {
        // No parameters needed for this endpoint - authentication is handled via credentials
        const responseData = await this.executeRequest(context, {
            method: 'GET',
            url: buildLumaApiUrl(LUMA_ENDPOINTS.USER_GET_SELF)
        });

        return this.createReturnItem(responseData, context.itemIndex);
    }
}
