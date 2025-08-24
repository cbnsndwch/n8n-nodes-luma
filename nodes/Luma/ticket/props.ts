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
            name: 'Create New Ticket Type',
            value: 'create',
            action: 'Create new ticket type'
        },
        {
            name: 'Get Ticket Type Details',
            value: 'get',
            action: 'Get ticket type details'
        },
        {
            name: 'List Event Ticket Types',
            value: 'list',
            action: 'List event ticket types'
        },
        {
            name: 'Update Ticket Type Configuration',
            value: 'update',
            action: 'Update ticket type configuration'
        }
    ],
    default: 'create'
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
            operation: ['list', 'create']
        }
    },
    description:
        'The ID of the event to list ticket types for or create a ticket type in'
};

// Required fields for create operation
const ticketNameField: INodeProperties = {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
        show: {
            resource: ['ticket'],
            operation: ['create']
        }
    },
    description: 'The name of the ticket type'
};

const ticketPriceField: INodeProperties = {
    displayName: 'Price (in Cents)',
    name: 'price',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
        show: {
            resource: ['ticket'],
            operation: ['create']
        }
    },
    description: 'The price of the ticket in cents (e.g., 2500 for $25.00)'
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
            operation: ['get', 'update']
        }
    },
    description: 'The ID of the ticket type to get details for or update'
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

// Additional fields for ticket create operation
const ticketCreateAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['ticket'],
            operation: ['create']
        }
    },
    // eslint-disable-next-line n8n-nodes-base/node-param-collection-type-unsorted-items
    options: [
        {
            displayName: 'Capacity',
            name: 'capacity',
            type: 'number',
            default: undefined,
            description:
                'Maximum number of tickets available (leave empty for unlimited)'
        },
        {
            displayName: 'Description',
            name: 'description',
            type: 'string',
            default: '',
            description: 'Description of the ticket type'
        },
        {
            displayName: 'Minimum Quantity',
            name: 'minQuantity',
            type: 'number',
            default: 1,
            description: 'Minimum number of tickets a user can purchase'
        },
        {
            displayName: 'Maximum Quantity',
            name: 'maxQuantity',
            type: 'number',
            default: 10,
            description: 'Maximum number of tickets a user can purchase'
        },
        {
            displayName: 'Sale Start Date',
            name: 'saleStartAt',
            type: 'dateTime',
            default: '',
            description: 'When ticket sales should start (ISO 8601 format)'
        },
        {
            displayName: 'Sale End Date',
            name: 'saleEndAt',
            type: 'dateTime',
            default: '',
            description: 'When ticket sales should end (ISO 8601 format)'
        },
        {
            displayName: 'Is Hidden',
            name: 'isHidden',
            type: 'boolean',
            default: false,
            description:
                'Whether the ticket type should be hidden from public view'
        },
        {
            displayName: 'Requires Approval',
            name: 'requiresApproval',
            type: 'boolean',
            default: false,
            description: 'Whether ticket purchases require manual approval'
        },
        {
            displayName: 'Pricing Tiers',
            name: 'pricingTiers',
            type: 'fixedCollection',
            default: {},
            description: 'Time-based pricing tiers for early bird pricing',
            typeOptions: {
                multipleValues: true
            },
            options: [
                {
                    name: 'tier',
                    displayName: 'Pricing Tier',
                    values: [
                        {
                            displayName: 'Capacity',
                            name: 'capacity',
                            type: 'number',
                            default: 0,
                            description:
                                'Number of tickets available at this price tier'
                        },
                        {
                            displayName: 'End Date',
                            name: 'endAt',
                            type: 'dateTime',
                            default: '',
                            description:
                                'When this pricing tier ends (optional)'
                        },
                        {
                            displayName: 'Name',
                            name: 'name',
                            type: 'string',
                            default: '',
                            description: 'Name of this pricing tier'
                        },
                        {
                            displayName: 'Price (in Cents)',
                            name: 'price',
                            type: 'number',
                            default: 0,
                            description: 'Price for this tier in cents'
                        },
                        {
                            displayName: 'Start Date',
                            name: 'startAt',
                            type: 'dateTime',
                            default: '',
                            description: 'When this pricing tier becomes active'
                        }
                    ]
                }
            ]
        },
        {
            displayName: 'Discount Rules',
            name: 'discountRules',
            type: 'fixedCollection',
            default: {},
            description:
                'Discount rules for bulk purchases, early bird discounts, etc',
            typeOptions: {
                multipleValues: true
            },
            options: [
                {
                    name: 'rule',
                    displayName: 'Discount Rule',
                    values: [
                        {
                            displayName: 'Type',
                            name: 'type',
                            type: 'options',
                            options: [
                                {
                                    name: 'Early Bird',
                                    value: 'early_bird'
                                },
                                {
                                    name: 'Bulk Purchase',
                                    value: 'bulk'
                                },
                                {
                                    name: 'Promo Code',
                                    value: 'promo_code'
                                }
                            ],
                            default: 'early_bird',
                            description: 'Type of discount rule'
                        },
                        {
                            displayName: 'Value',
                            name: 'value',
                            type: 'number',
                            default: 0,
                            description:
                                'Discount value (percentage or fixed amount in cents)'
                        },
                        {
                            displayName: 'Minimum Quantity',
                            name: 'minQuantity',
                            type: 'number',
                            default: 1,
                            description:
                                'Minimum quantity required for this discount'
                        },
                        {
                            displayName: 'Valid Until',
                            name: 'validUntil',
                            type: 'dateTime',
                            default: '',
                            description: 'When this discount rule expires'
                        }
                    ]
                }
            ]
        }
    ]
};

// Update fields for ticket update operation
const ticketUpdateFields: INodeProperties = {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['ticket'],
            operation: ['update']
        }
    },
    // eslint-disable-next-line n8n-nodes-base/node-param-collection-type-unsorted-items
    options: [
        {
            displayName: 'Name',
            name: 'name',
            type: 'string',
            default: '',
            description: 'The name of the ticket type'
        },
        {
            displayName: 'Description',
            name: 'description',
            type: 'string',
            default: '',
            description: 'Description of the ticket type'
        },
        {
            displayName: 'Price (in Cents)',
            name: 'price',
            type: 'number',
            default: undefined,
            description:
                'The price of the ticket in cents (e.g., 2500 for $25.00)'
        },
        {
            displayName: 'Capacity',
            name: 'capacity',
            type: 'number',
            default: undefined,
            description:
                'Maximum number of tickets available (leave empty for unlimited)'
        },
        {
            displayName: 'Minimum Quantity',
            name: 'minQuantity',
            type: 'number',
            default: undefined,
            description: 'Minimum number of tickets a user can purchase'
        },
        {
            displayName: 'Maximum Quantity',
            name: 'maxQuantity',
            type: 'number',
            default: undefined,
            description: 'Maximum number of tickets a user can purchase'
        },
        {
            displayName: 'Sale Start Date',
            name: 'saleStartAt',
            type: 'dateTime',
            default: '',
            description: 'When ticket sales should start (ISO 8601 format)'
        },
        {
            displayName: 'Sale End Date',
            name: 'saleEndAt',
            type: 'dateTime',
            default: '',
            description: 'When ticket sales should end (ISO 8601 format)'
        },
        {
            displayName: 'Is Hidden',
            name: 'isHidden',
            type: 'boolean',
            default: false,
            description:
                'Whether the ticket type should be hidden from public view'
        },
        {
            displayName: 'Requires Approval',
            name: 'requiresApproval',
            type: 'boolean',
            default: false,
            description: 'Whether ticket purchases require manual approval'
        },
        {
            displayName: 'Pricing Tiers',
            name: 'pricingTiers',
            type: 'fixedCollection',
            default: {},
            description: 'Time-based pricing tiers for early bird pricing',
            typeOptions: {
                multipleValues: true
            },
            options: [
                {
                    name: 'tier',
                    displayName: 'Pricing Tier',
                    values: [
                        {
                            displayName: 'Capacity',
                            name: 'capacity',
                            type: 'number',
                            default: 0,
                            description:
                                'Number of tickets available at this price tier'
                        },
                        {
                            displayName: 'End Date',
                            name: 'endAt',
                            type: 'dateTime',
                            default: '',
                            description:
                                'When this pricing tier ends (optional)'
                        },
                        {
                            displayName: 'Name',
                            name: 'name',
                            type: 'string',
                            default: '',
                            description: 'Name of this pricing tier'
                        },
                        {
                            displayName: 'Price (in Cents)',
                            name: 'price',
                            type: 'number',
                            default: 0,
                            description: 'Price for this tier in cents'
                        },
                        {
                            displayName: 'Start Date',
                            name: 'startAt',
                            type: 'dateTime',
                            default: '',
                            description: 'When this pricing tier becomes active'
                        }
                    ]
                }
            ]
        },
        {
            displayName: 'Discount Rules',
            name: 'discountRules',
            type: 'fixedCollection',
            default: {},
            description:
                'Discount rules for bulk purchases, early bird discounts, etc',
            typeOptions: {
                multipleValues: true
            },
            options: [
                {
                    name: 'rule',
                    displayName: 'Discount Rule',
                    values: [
                        {
                            displayName: 'Type',
                            name: 'type',
                            type: 'options',
                            options: [
                                {
                                    name: 'Early Bird',
                                    value: 'early_bird'
                                },
                                {
                                    name: 'Bulk Purchase',
                                    value: 'bulk'
                                },
                                {
                                    name: 'Promo Code',
                                    value: 'promo_code'
                                }
                            ],
                            default: 'early_bird',
                            description: 'Type of discount rule'
                        },
                        {
                            displayName: 'Value',
                            name: 'value',
                            type: 'number',
                            default: 0,
                            description:
                                'Discount value (percentage or fixed amount in cents)'
                        },
                        {
                            displayName: 'Minimum Quantity',
                            name: 'minQuantity',
                            type: 'number',
                            default: 1,
                            description:
                                'Minimum quantity required for this discount'
                        },
                        {
                            displayName: 'Valid Until',
                            name: 'validUntil',
                            type: 'dateTime',
                            default: '',
                            description: 'When this discount rule expires'
                        }
                    ]
                }
            ]
        }
    ]
};

// Additional fields for ticket update operation
const ticketUpdateAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['ticket'],
            operation: ['update']
        }
    },
    options: [
        {
            displayName: 'Preserve Existing Sales',
            name: 'preserveExistingSales',
            type: 'boolean',
            default: true,
            description:
                'Whether to preserve existing sales data during updates'
        },
        {
            displayName: 'Notify Existing Buyers',
            name: 'notifyExistingBuyers',
            type: 'boolean',
            default: false,
            description: 'Whether to notify existing ticket buyers of changes'
        },
        {
            displayName: 'Reason for Change',
            name: 'reasonForChange',
            type: 'string',
            default: '',
            description: 'Optional reason for the ticket type update'
        }
    ]
};

export const ticketProps: INodeProperties[] = [
    ticketOperations,
    eventIdField,
    ticketNameField,
    ticketPriceField,
    ticketTypeIdField,
    ticketAdditionalFields,
    ticketGetAdditionalFields,
    ticketCreateAdditionalFields,
    ticketUpdateFields,
    ticketUpdateAdditionalFields
];
