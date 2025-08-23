import type { IDataObject, INodeExecutionData } from 'n8n-workflow';
import { BaseOperations } from '../shared/BaseOperations';
import { buildLumaApiUrl, LUMA_ENDPOINTS } from '../../utils/constants';
import type {
    LumaOperationContext,
    ImageUploadData
} from '../shared/OperationTypes';

// Utility-specific operations

export class UtilityOperations extends BaseOperations {
    /**
     * Create image upload URL
     */
    static async createImageUploadUrl(
        context: LumaOperationContext
    ): Promise<INodeExecutionData> {
        const imageType = context.executeFunctions.getNodeParameter(
            'imageType',
            context.itemIndex
        ) as string;

        const additionalFields = context.executeFunctions.getNodeParameter(
            'additionalFields',
            context.itemIndex
        ) as IDataObject;

        const requestBody: ImageUploadData = {};

        // Add image type if specified
        if (imageType) {
            requestBody.image_type = imageType as
                | 'event_cover'
                | 'calendar_avatar'
                | 'user_avatar';
        }

        // Add optional fields if specified
        if (additionalFields.maxSizeBytes) {
            requestBody.max_size_bytes =
                additionalFields.maxSizeBytes as number;
        }

        if (additionalFields.allowedFormats) {
            requestBody.allowed_formats =
                additionalFields.allowedFormats as string[];
        }

        if (additionalFields.expirationMinutes) {
            requestBody.expiration_minutes =
                additionalFields.expirationMinutes as number;
        }

        const responseData = await this.executeRequest(context, {
            method: 'POST',
            url: buildLumaApiUrl(LUMA_ENDPOINTS.IMAGE_CREATE_UPLOAD_URL),
            body: requestBody
        });

        return this.createReturnItem(responseData, context.itemIndex);
    }
}
