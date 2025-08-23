import type { INodeProperties } from 'n8n-workflow';

// Utility resource parameter descriptions

export const utilityOperations: INodeProperties = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
        show: {
            resource: ['utility']
        }
    },
    options: [
        {
            name: 'Create Image Upload URL',
            value: 'createImageUploadUrl',
            action: 'Create image upload URL'
        }
    ],
    default: 'createImageUploadUrl'
};

// Image type field for upload URL creation
export const imageTypeField: INodeProperties = {
    displayName: 'Image Type',
    name: 'imageType',
    type: 'options',
    displayOptions: {
        show: {
            resource: ['utility'],
            operation: ['createImageUploadUrl']
        }
    },
    options: [
        {
            name: 'Event Cover',
            value: 'event_cover'
        },
        {
            name: 'Calendar Avatar',
            value: 'calendar_avatar'
        },
        {
            name: 'User Avatar',
            value: 'user_avatar'
        }
    ],
    default: 'event_cover',
    description: 'The type of image to upload'
};

// Additional fields for image upload URL creation
export const utilityAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['utility'],
            operation: ['createImageUploadUrl']
        }
    },
    options: [
        {
            displayName: 'Max Size (Bytes)',
            name: 'maxSizeBytes',
            type: 'number',
            default: 5242880,
            description: 'Maximum file size in bytes (default: 5MB)'
        },
        {
            displayName: 'Allowed Formats',
            name: 'allowedFormats',
            type: 'multiOptions',
            options: [
                {
                    name: 'GIF',
                    value: 'gif'
                },
                {
                    name: 'JPEG',
                    value: 'jpeg'
                },
                {
                    name: 'JPG',
                    value: 'jpg'
                },
                {
                    name: 'PNG',
                    value: 'png'
                },
                {
                    name: 'WEBP',
                    value: 'webp'
                }
            ],
            default: ['jpg', 'png'],
            description: 'Allowed image formats for upload'
        },
        {
            displayName: 'Expiration (Minutes)',
            name: 'expirationMinutes',
            type: 'number',
            default: 60,
            description: 'Upload URL expiration time in minutes'
        }
    ]
};
