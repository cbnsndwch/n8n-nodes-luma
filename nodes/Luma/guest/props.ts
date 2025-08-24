import type { INodeProperties } from 'n8n-workflow';

/**
 * Guest operations
 */
const guestOperations: INodeProperties = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
        show: {
            resource: ['guest']
        }
    },
    options: [
        {
            name: 'Get',
            value: 'get',
            description: 'Get detailed information about a specific guest',
            action: 'Get guest details'
        },
        {
            name: 'List',
            value: 'list',
            description: 'Get all guests for a specific event',
            action: 'List guests for an event'
        }
    ],
    default: 'list'
};

/**
 * Event ID field for guest operations
 */
const eventIdField: INodeProperties = {
    displayName: 'Event ID',
    name: 'eventId',
    type: 'string',
    required: true,
    displayOptions: {
        show: {
            resource: ['guest'],
            operation: ['list']
        }
    },
    default: '',
    placeholder: 'evt-abc123def456',
    description: 'The unique identifier of the event to list guests for'
};

/**
 * Guest ID field for get operation
 */
const guestIdField: INodeProperties = {
    displayName: 'Guest ID',
    name: 'guestId',
    type: 'string',
    required: true,
    displayOptions: {
        show: {
            resource: ['guest'],
            operation: ['get']
        }
    },
    default: '',
    placeholder: 'gst-abc123def456',
    description: 'The unique identifier of the guest to retrieve'
};

/**
 * Additional fields collection for guest operations
 */
const guestAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['guest'],
            operation: ['list']
        }
    },
    options: [
        {
            displayName: 'Approval Status',
            name: 'approvalStatus',
            type: 'options',
            options: [
                {
                    name: 'Approved',
                    value: 'approved'
                },
                {
                    name: 'Pending',
                    value: 'pending'
                },
                {
                    name: 'Rejected',
                    value: 'rejected'
                }
            ],
            default: 'approved',
            description: 'Filter guests by approval status'
        },
        {
            displayName: 'Attendance Status',
            name: 'attendanceStatus',
            type: 'options',
            options: [
                {
                    name: 'Attended',
                    value: 'attended'
                },
                {
                    name: 'No Show',
                    value: 'no_show'
                },
                {
                    name: 'Checked In',
                    value: 'checked_in'
                }
            ],
            default: 'attended',
            description: 'Filter guests by attendance status'
        },
        {
            displayName: 'Include Contact Info',
            name: 'includeContactInfo',
            type: 'boolean',
            default: true,
            description:
                'Whether to include guest contact information in the response'
        },
        {
            displayName: 'Limit',
            name: 'limit',
            type: 'number',
            typeOptions: {
                minValue: 1
            },
            default: 50,
            description: 'Max number of results to return'
        },
        {
            displayName: 'Pagination Cursor',
            name: 'after',
            type: 'string',
            default: '',
            placeholder: 'Value from previous response next_cursor',
            description: 'Cursor for pagination from previous request'
        },
        {
            displayName: 'Registration Status',
            name: 'registrationStatus',
            type: 'options',
            options: [
                {
                    name: 'Confirmed',
                    value: 'confirmed'
                },
                {
                    name: 'Cancelled',
                    value: 'cancelled'
                },
                {
                    name: 'Waitlisted',
                    value: 'waitlisted'
                }
            ],
            default: 'confirmed',
            description: 'Filter guests by registration status'
        }
    ]
};

/**
 * Additional fields collection for guest get operation
 */
const guestGetAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['guest'],
            operation: ['get']
        }
    },
    options: [
        {
            displayName: 'Include History',
            name: 'includeHistory',
            type: 'boolean',
            default: false,
            description:
                'Whether to include registration history and timestamps'
        },
        {
            displayName: 'Include Personal Info',
            name: 'includePersonalInfo',
            type: 'boolean',
            default: true,
            description:
                'Whether to include personal information in the response'
        },
        {
            displayName: 'Include Event Details',
            name: 'includeEventDetails',
            type: 'boolean',
            default: false,
            description: 'Whether to include event-specific information'
        }
    ]
};

/**
 * Export all guest properties
 */
export const guestProps: INodeProperties[] = [
    guestOperations,
    eventIdField,
    guestIdField,
    guestAdditionalFields,
    guestGetAdditionalFields
];
