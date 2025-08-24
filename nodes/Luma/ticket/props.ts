import type { INodeProperties } from 'n8n-workflow';

const ticketOperations: INodeProperties = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
        show: {
            resource: ['ticket']
        }
    },
    options: [
        {
            name: 'Get Ticket Type Details',
            value: 'get',
            action: 'Get ticket type details'
        },
        {
            name: 'List Event Ticket Types',
            value: 'list',
            action: 'List event ticket types'
        }
    ],
    default: 'get'
};

// Event ID field for ticket operations
const eventIdField: INodeProperties = {
    displayName: 'Event ID',
    name: 'eventId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
        show: {
            resource: ['ticket'],
            operation: ['list']
        }
    },
    description: 'The ID of the event to list ticket types for'
};

// Ticket Type ID field for get operation
const ticketTypeIdField: INodeProperties = {
    displayName: 'Ticket Type ID',
    name: 'ticketTypeId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
        show: {
            resource: ['ticket'],
            operation: ['get']
        }
    },
    description: 'The ID of the ticket type to get details for'
};

// Additional fields for ticket operations
const ticketAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['ticket'],
            operation: ['list']
        }
    },
    options: [
        {
            displayName: 'Include Sold Out',
            name: 'include_sold_out',
            type: 'boolean',
            default: true,
            description: 'Whether to include ticket types that are sold out'
        },
        {
            displayName: 'Include Stats',
            name: 'include_stats',
            type: 'boolean',
            default: false,
            description:
                'Whether to include sales statistics for each ticket type'
        },
        {
            displayName: 'Sort By',
            name: 'sort_by',
            type: 'options',
            options: [
                {
                    name: 'Price',
                    value: 'price'
                },
                {
                    name: 'Name',
                    value: 'name'
                },
                {
                    name: 'Created At',
                    value: 'created_at'
                },
                {
                    name: 'Sales Count',
                    value: 'sales_count'
                }
            ],
            default: 'name',
            description: 'Field to sort ticket types by'
        },
        {
            displayName: 'Sort Order',
            name: 'sort_order',
            type: 'options',
            options: [
                {
                    name: 'Ascending',
                    value: 'asc'
                },
                {
                    name: 'Descending',
                    value: 'desc'
                }
            ],
            default: 'asc',
            description: 'Sort order for ticket types'
        },
        {
            displayName: 'Status',
            name: 'status',
            type: 'options',
            options: [
                {
                    name: 'Active',
                    value: 'active'
                },
                {
                    name: 'Hidden',
                    value: 'hidden'
                },
                {
                    name: 'Archived',
                    value: 'archived'
                }
            ],
            default: 'active',
            description: 'Filter ticket types by status'
        }
    ]
};

// Additional fields for ticket get operation
const ticketGetAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['ticket'],
            operation: ['get']
        }
    },
    options: [
        {
            displayName: 'Include Analytics',
            name: 'includeAnalytics',
            type: 'boolean',
            default: false,
            description: 'Whether to include analytics data in the response'
        },
        {
            displayName: 'Include Pricing History',
            name: 'includePricingHistory',
            type: 'boolean',
            default: false,
            description: 'Whether to include pricing history in the response'
        },
        {
            displayName: 'Include Discount Rules',
            name: 'includeDiscountRules',
            type: 'boolean',
            default: false,
            description: 'Whether to include discount rules in the response'
        }
    ]
};

export const ticketProps: INodeProperties[] = [
    ticketOperations,
    eventIdField,
    ticketTypeIdField,
    ticketAdditionalFields,
    ticketGetAdditionalFields
];
