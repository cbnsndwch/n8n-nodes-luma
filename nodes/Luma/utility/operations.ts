import type { IDataObject, INodeExecutionData } from 'n8n-workflow';

import { buildLumaApiUrl, LUMA_ENDPOINTS } from '../shared/constants';

import { BaseOperations } from '../shared/operations.base';
import type { LumaOperationContext } from '../shared/contracts';

import type { ImageUploadData } from './contracts';

class UtilityOperations extends BaseOperations {
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

export async function handleUtilityOperation(
    operation: string,
    context: LumaOperationContext
): Promise<INodeExecutionData> {
    let result: INodeExecutionData;

    switch (operation) {
        case 'createImageUploadUrl':
            result = await UtilityOperations.createImageUploadUrl(context);
            break;
        case 'entityLookup':
            result = await UtilityOperations.entityLookup(context);
            break;
        default:
            throw new Error(
                `The operation "${operation}" is not supported for utility resource!`
            );
    }

    return result;
}
