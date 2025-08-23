import type { INodeProperties } from 'n8n-workflow';

// Utility resource parameter descriptions

export const utilityResource: INodeProperties = {
    displayName: 'Resource',
    name: 'resource',
    type: 'options',
    noDataExpression: true,
    options: [
        {
            name: 'Utility',
            value: 'utility'
        }
    ],
    default: 'utility'
};

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
            name: 'Entity Lookup',
            value: 'entityLookup',
            action: 'Lookup entity by slug'
        }
    ],
    default: 'entityLookup'
};

// Required slug field for entity lookup
export const slugField: INodeProperties = {
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

// Additional fields collection for utility operations
export const utilityAdditionalFields: INodeProperties = {
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
