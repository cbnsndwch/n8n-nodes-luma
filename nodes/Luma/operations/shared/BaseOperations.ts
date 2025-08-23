import type { IDataObject, INodeExecutionData } from 'n8n-workflow';
import type {
    LumaApiRequest,
    LumaOperationContext,
    LocationData
} from './OperationTypes';

// Base operation patterns for common CRUD operations

export abstract class BaseOperations {
    /**
     * Execute an authenticated API request to Luma
     */
    protected static async executeRequest(
        context: LumaOperationContext,
        request: LumaApiRequest
    ): Promise<any> {
        return await context.executeFunctions.helpers.requestWithAuthentication.call(
            context.executeFunctions,
            'lumaApi',
            {
                ...request,
                json: true
            }
        );
    }

    /**
     * Create a return data item
     */
    protected static createReturnItem(
        data: IDataObject,
        itemIndex: number
    ): INodeExecutionData {
        return {
            json: data,
            pairedItem: { item: itemIndex }
        };
    }

    /**
     * Handle multiple items from API response (for getMany operations)
     */
    protected static handleMultipleItems(
        responseData: any,
        itemIndex: number,
        entriesField = 'entries'
    ): INodeExecutionData[] {
        const items: INodeExecutionData[] = [];
        const entries = responseData[entriesField] || responseData;

        if (Array.isArray(entries)) {
            entries.forEach(entry => {
                items.push(this.createReturnItem(entry, itemIndex));
            });
        } else {
            items.push(this.createReturnItem(responseData, itemIndex));
        }

        return items;
    }

    /**
     * Build location object from additional fields
     */
    protected static buildLocationObject(
        additionalFields: IDataObject
    ): LocationData | undefined {
        if (!additionalFields.locationType) {
            return undefined;
        }

        const location: LocationData = {
            type: additionalFields.locationType as string
        };

        if (additionalFields.locationName) {
            location.name = additionalFields.locationName as string;
        }
        if (additionalFields.locationAddress) {
            location.address = additionalFields.locationAddress as string;
        }
        if (additionalFields.locationUrl) {
            location.url = additionalFields.locationUrl as string;
        }

        return location;
    }
}
