import { NodeOperationError, type INodeExecutionData } from 'n8n-workflow';

import { buildLumaApiUrl, LUMA_ENDPOINTS } from '../shared/constants';

import type { LumaOperationContext } from '../shared/contracts';
import { BaseOperations } from '../shared/operations.base';

// User-specific operations

class UserOperations extends BaseOperations {
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

export async function handleUserOperation(
    operation: string,
    context: LumaOperationContext
) {
    let result: INodeExecutionData;

    switch (operation) {
        case 'getSelf':
            result = await UserOperations.getSelf(context);
            break;
        default:
            throw new NodeOperationError(
                context.executeFunctions.getNode(),
                `The operation "${operation}" is not supported for user resource!`
            );
    }

    return result;
}
