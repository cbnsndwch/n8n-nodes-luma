import type { INodeProperties } from 'n8n-workflow';

/**
 * Utility resource parameter descriptions
 */
const utilityOperations: INodeProperties = {
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
        },
        {
            name: 'Entity Lookup',
            value: 'entityLookup',
            action: 'Lookup entity by slug'
        }
    ],
    default: 'createImageUploadUrl'
};

//#region Image Upload URL Creation

/**
 * Image type field for upload URL creation
 */
const imageTypeField: INodeProperties = {
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

/**
 * Additional fields for image upload URL creation
 */
const createImageUploadUrlAdditionalFields: INodeProperties = {
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

//#endregion Image Upload URL Creation

//#region Entity Slug Lookup

/**
 * Required slug field for entity lookup
 */
const slugField: INodeProperties = {
    displayName: 'Slug',
    name: 'slug',
    type: 'string',
    required: true,
    displayOptions: {
        show: {
            resource: ['utility'],
            operation: ['entityLookup']
        }
    },
    default: '',
    description: 'The slug identifier for the entity to lookup'
};

/**
 * Additional fields collection for entity slug lookup
 */
const entityLookupAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['utility'],
            operation: ['entityLookup']
        }
    },
    options: [
        {
            displayName: 'Entity Type',
            name: 'entityType',
            type: 'options',
            options: [
                {
                    name: 'Event',
                    value: 'event'
                },
                {
                    name: 'Calendar',
                    value: 'calendar'
                },
                {
                    name: 'User',
                    value: 'user'
                }
            ],
            default: 'event',
            description: 'Filter by specific entity type'
        },
        {
            displayName: 'Include Details',
            name: 'includeDetails',
            type: 'boolean',
            default: false,
            description:
                'Whether to include additional entity details in the response'
        }
    ]
};

//#endregion Entity Slug Lookup

export const utilityProps = [
    utilityOperations,
    imageTypeField,
    createImageUploadUrlAdditionalFields,
    slugField,
    entityLookupAdditionalFields
];
