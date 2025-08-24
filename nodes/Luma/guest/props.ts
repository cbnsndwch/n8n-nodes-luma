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
            name: 'Approve',
            value: 'approve',
            description: 'Approve pending guest registrations',
            action: 'Approve guest registration'
        },
        {
            name: 'Cancel',
            value: 'cancel',
            description: 'Cancel guest registrations',
            action: 'Cancel guest registration'
        },
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
        },
        {
            name: 'Register',
            value: 'register',
            description: 'Register a guest for an event',
            action: 'Register guest for event'
        },
        {
            name: 'Reject',
            value: 'reject',
            description: 'Reject pending guest registrations',
            action: 'Reject guest registration'
        },
        {
            name: 'Update',
            value: 'update',
            description: 'Update guest information and status',
            action: 'Update guest information'
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
            operation: ['list', 'register']
        }
    },
    default: '',
    placeholder: 'evt-abc123def456',
    description: 'The unique identifier of the event to list guests for'
};

/**
 * Guest ID field for get, update, and approve operations
 */
const guestIdField: INodeProperties = {
    displayName: 'Guest ID',
    name: 'guestId',
    type: 'string',
    required: true,
    displayOptions: {
        show: {
            resource: ['guest'],
            operation: ['get', 'update', 'approve', 'reject', 'cancel']
        }
    },
    default: '',
    placeholder:
        'gst-abc123def456 or gst-abc123def456,gst-def789ghi012 for multiple',
    description:
        'The unique identifier(s) of the guest(s). For approve and reject operations, can be a single ID or comma-separated IDs for bulk operations.'
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
 * Required guest information fields for registration
 */
const guestNameField: INodeProperties = {
    displayName: 'Guest Name',
    name: 'name',
    type: 'string',
    required: true,
    displayOptions: {
        show: {
            resource: ['guest'],
            operation: ['register']
        }
    },
    default: '',
    description: 'Full name of the guest'
};

const guestEmailField: INodeProperties = {
    displayName: 'Guest Email',
    name: 'email',
    type: 'string',
    required: true,
    displayOptions: {
        show: {
            resource: ['guest'],
            operation: ['register']
        }
    },
    default: '',
    placeholder: 'name@email.com',
    description: 'Email address of the guest'
};

/**
 * Additional fields collection for guest registration
 */
const guestRegistrationAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['guest'],
            operation: ['register']
        }
    },
    options: [
        {
            displayName: 'Auto Approve',
            name: 'autoApprove',
            type: 'boolean',
            default: false,
            description: 'Whether to automatically approve the registration'
        },
        {
            displayName: 'Company',
            name: 'company',
            type: 'string',
            default: '',
            description: 'Company or organization name'
        },
        {
            displayName: 'Custom Message',
            name: 'customMessage',
            type: 'string',
            typeOptions: {
                rows: 3
            },
            default: '',
            description: 'Custom message to include in the invitation'
        },
        {
            displayName: 'First Name',
            name: 'firstName',
            type: 'string',
            default: '',
            description: 'First name of the guest'
        },
        {
            displayName: 'Job Title',
            name: 'jobTitle',
            type: 'string',
            default: '',
            description: 'Job title or position'
        },
        {
            displayName: 'Last Name',
            name: 'lastName',
            type: 'string',
            default: '',
            description: 'Last name of the guest'
        },
        {
            displayName: 'Phone',
            name: 'phone',
            type: 'string',
            default: '',
            description: 'Phone number of the guest'
        },
        {
            displayName: 'Send Invite',
            name: 'sendInvite',
            type: 'boolean',
            default: true,
            description: 'Whether to send an invitation email to the guest'
        },
        {
            displayName: 'Ticket Type ID',
            name: 'ticketTypeId',
            type: 'string',
            default: '',
            description: 'ID of the ticket type to assign'
        }
    ]
};

/**
 * Update fields collection for guest update operation
 */
const guestUpdateFields: INodeProperties = {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['guest'],
            operation: ['update']
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
            default: 'pending',
            description: 'Approval status of the guest'
        },
        {
            displayName: 'Company',
            name: 'company',
            type: 'string',
            default: '',
            description: 'Company or organization name'
        },
        {
            displayName: 'Custom Fields',
            name: 'customFields',
            type: 'fixedCollection',
            typeOptions: {
                multipleValues: true
            },
            default: {},
            description: 'Custom fields for the guest',
            options: [
                {
                    name: 'customField',
                    displayName: 'Custom Field',
                    values: [
                        {
                            displayName: 'Field Name',
                            name: 'name',
                            type: 'string',
                            default: '',
                            description: 'Name of the custom field'
                        },
                        {
                            displayName: 'Field Value',
                            name: 'value',
                            type: 'string',
                            default: '',
                            description: 'Value of the custom field'
                        }
                    ]
                }
            ]
        },
        {
            displayName: 'Email',
            name: 'email',
            type: 'string',
            default: '',
            placeholder: 'name@email.com',
            description: 'Email address of the guest'
        },
        {
            displayName: 'First Name',
            name: 'firstName',
            type: 'string',
            default: '',
            description: 'First name of the guest'
        },
        {
            displayName: 'Job Title',
            name: 'jobTitle',
            type: 'string',
            default: '',
            description: 'Job title or position'
        },
        {
            displayName: 'Last Name',
            name: 'lastName',
            type: 'string',
            default: '',
            description: 'Last name of the guest'
        },
        {
            displayName: 'Name',
            name: 'name',
            type: 'string',
            default: '',
            description: 'Full name of the guest'
        },
        {
            displayName: 'Notes',
            name: 'notes',
            type: 'string',
            typeOptions: {
                rows: 3
            },
            default: '',
            description: 'Additional notes about the guest'
        },
        {
            displayName: 'Phone',
            name: 'phone',
            type: 'string',
            default: '',
            description: 'Phone number of the guest'
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
            description: 'Registration status of the guest'
        }
    ]
};

/**
 * Additional fields collection for guest update operation
 */
const guestUpdateAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['guest'],
            operation: ['update']
        }
    },
    options: [
        {
            displayName: 'Notify Guest',
            name: 'notifyGuest',
            type: 'boolean',
            default: false,
            description:
                'Whether to send a notification to the guest about the update'
        },
        {
            displayName: 'Reason for Change',
            name: 'reasonForChange',
            type: 'string',
            typeOptions: {
                rows: 2
            },
            default: '',
            description: 'Reason for the guest information update'
        }
    ]
};

/**
 * Additional fields collection for guest approve operation
 */
const guestApproveAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['guest'],
            operation: ['approve']
        }
    },
    options: [
        {
            displayName: 'Send Notification',
            name: 'sendNotification',
            type: 'boolean',
            default: true,
            description: 'Whether to send approval notification to the guest'
        },
        {
            displayName: 'Approval Notes',
            name: 'approvalNotes',
            type: 'string',
            typeOptions: {
                rows: 3
            },
            default: '',
            description: 'Internal notes about the approval decision'
        },
        {
            displayName: 'Ticket Type ID',
            name: 'ticketTypeId',
            type: 'string',
            default: '',
            description: 'Assign specific ticket type upon approval'
        },
        {
            displayName: 'Custom Message',
            name: 'customMessage',
            type: 'string',
            typeOptions: {
                rows: 3
            },
            default: '',
            description:
                'Custom message to include in the approval notification'
        }
    ]
};

/**
 * Rejection reason field for guest reject operation
 */
const guestRejectionReasonField: INodeProperties = {
    displayName: 'Rejection Reason',
    name: 'rejectionReason',
    type: 'string',
    required: true,
    displayOptions: {
        show: {
            resource: ['guest'],
            operation: ['reject']
        }
    },
    typeOptions: {
        rows: 3
    },
    default: '',
    placeholder: 'Reason for rejecting the guest registration',
    description: 'The reason for rejecting the guest registration'
};

/**
 * Additional fields collection for guest reject operation
 */
const guestRejectAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['guest'],
            operation: ['reject']
        }
    },
    options: [
        {
            displayName: 'Send Notification',
            name: 'sendNotification',
            type: 'boolean',
            default: true,
            description: 'Whether to send rejection notification to the guest'
        },
        {
            displayName: 'Custom Message',
            name: 'customMessage',
            type: 'string',
            typeOptions: {
                rows: 3
            },
            default: '',
            description:
                'Custom message to include in the rejection notification'
        },
        {
            displayName: 'Allow Reapply',
            name: 'allowReapply',
            type: 'boolean',
            default: false,
            description: 'Whether to allow the guest to reapply for the event'
        }
    ]
};

/**
 * Cancelled By field for guest cancel operation
 */
const guestCancelledByField: INodeProperties = {
    displayName: 'Cancelled By',
    name: 'cancelledBy',
    type: 'options',
    required: true,
    displayOptions: {
        show: {
            resource: ['guest'],
            operation: ['cancel']
        }
    },
    options: [
        {
            name: 'Guest',
            value: 'guest'
        },
        {
            name: 'Organizer',
            value: 'organizer'
        }
    ],
    default: 'guest',
    description: 'Who is cancelling the registration'
};

/**
 * Additional fields collection for guest cancel operation
 */
const guestCancelAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['guest'],
            operation: ['cancel']
        }
    },
    options: [
        {
            displayName: 'Cancellation Reason',
            name: 'cancellationReason',
            type: 'string',
            typeOptions: {
                rows: 3
            },
            default: '',
            description: 'Reason for cancelling the registration'
        },
        {
            displayName: 'Send Notification',
            name: 'sendNotification',
            type: 'boolean',
            default: true,
            description: 'Whether to send cancellation notification to the guest'
        },
        {
            displayName: 'Refund Amount',
            name: 'refundAmount',
            type: 'number',
            typeOptions: {
                numberPrecision: 2,
                minValue: 0
            },
            default: 0,
            description: 'Amount to refund (if applicable)'
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
    guestNameField,
    guestEmailField,
    guestRejectionReasonField,
    guestCancelledByField,
    guestAdditionalFields,
    guestGetAdditionalFields,
    guestRegistrationAdditionalFields,
    guestUpdateFields,
    guestUpdateAdditionalFields,
    guestApproveAdditionalFields,
    guestRejectAdditionalFields,
    guestCancelAdditionalFields
];
