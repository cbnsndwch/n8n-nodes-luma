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
            name: 'List Event Ticket Types',
            value: 'list',
            action: 'List event ticket types'
        }
    ],
    default: 'list'
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

export const ticketProps: INodeProperties[] = [
    ticketOperations,
    eventIdField,
    ticketAdditionalFields
];
