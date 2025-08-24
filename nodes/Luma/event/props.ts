import type { INodeProperties } from 'n8n-workflow';

import {
    idField,
    limitField,
    visibilityField,
    approvalRequiredField,
    capacityField,
    afterCursorField,
    beforeCursorField,
    forceDeleteField
} from '../shared/props/common.props';
import {
    locationTypeField,
    locationNameField,
    locationAddressField,
    locationUrlField
} from '../shared/props/location.props';
import {
    startDateField,
    endDateField,
    timezoneField
} from '../shared/props/date-time.props';

const eventOperations: INodeProperties = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
        show: {
            resource: ['event']
        }
    },
    options: [
        {
            name: 'Create',
            value: 'create',
            action: 'Create an event'
        },
        {
            name: 'Create Coupon',
            value: 'createCoupon',
            action: 'Create an event coupon'
        },
        {
            name: 'Delete',
            value: 'delete',
            action: 'Delete an event'
        },
        {
            name: 'Get Event Details',
            value: 'get',
            action: 'Get an event'
        },
        {
            name: 'List Coupons',
            value: 'listCoupons',
            action: 'List event coupons'
        },
        {
            name: 'List Events',
            value: 'getMany',
            action: 'Get many events'
        },
        {
            name: 'Update',
            value: 'update',
            action: 'Update an event'
        },
        {
            name: 'Update Coupon',
            value: 'updateCoupon',
            action: 'Update an event coupon'
        }
    ],
    default: 'get'
};

/**
 * Event-specific required fields
 */
const eventIdField = idField('Event ID', 'eventId', 'The ID of the event', {
    resource: ['event'],
    operation: [
        'get',
        'update',
        'delete',
        'listCoupons',
        'createCoupon',
        'updateCoupon'
    ]
});

const eventNameField: INodeProperties = {
    displayName: 'Event Name',
    name: 'eventName',
    type: 'string',
    required: true,
    displayOptions: {
        show: {
            resource: ['event'],
            operation: ['create']
        }
    },
    default: '',
    description: 'The name of the event'
};

const eventDescriptionField: INodeProperties = {
    displayName: 'Event Description',
    name: 'eventDescription',
    type: 'string',
    displayOptions: {
        show: {
            resource: ['event'],
            operation: ['create', 'update']
        }
    },
    default: '',
    description: 'The description of the event'
};

/**
 * Coupon-specific required fields for createCoupon operation
 */
const couponNameField: INodeProperties = {
    displayName: 'Coupon Name',
    name: 'couponName',
    type: 'string',
    required: true,
    displayOptions: {
        show: {
            resource: ['event'],
            operation: ['createCoupon']
        }
    },
    default: '',
    description: 'The display name for the coupon'
};

const couponCodeField: INodeProperties = {
    displayName: 'Coupon Code',
    name: 'couponCode',
    type: 'string',
    required: true,
    displayOptions: {
        show: {
            resource: ['event'],
            operation: ['createCoupon']
        }
    },
    default: '',
    description:
        'The unique coupon code that users will enter. Must be alphanumeric with optional hyphens/underscores.'
};

const discountTypeField: INodeProperties = {
    displayName: 'Discount Type',
    name: 'discountType',
    type: 'options',
    required: true,
    displayOptions: {
        show: {
            resource: ['event'],
            operation: ['createCoupon']
        }
    },
    options: [
        {
            name: 'Percentage',
            value: 'percentage'
        },
        {
            name: 'Fixed Amount',
            value: 'fixed_amount'
        }
    ],
    default: 'percentage',
    description: 'Type of discount to apply'
};

const discountValueField: INodeProperties = {
    displayName: 'Discount Value',
    name: 'discountValue',
    type: 'number',
    required: true,
    displayOptions: {
        show: {
            resource: ['event'],
            operation: ['createCoupon']
        }
    },
    default: 10,
    description: 'Discount amount (percentage 0-100 or cents for fixed amount)'
};

/**
 * Coupon ID field for updateCoupon operation
 */
const couponIdField: INodeProperties = {
    displayName: 'Coupon ID',
    name: 'couponId',
    type: 'string',
    required: true,
    displayOptions: {
        show: {
            resource: ['event'],
            operation: ['updateCoupon']
        }
    },
    default: '',
    placeholder: 'coupon_123abc...',
    description: 'API ID of the coupon to update'
};

/**
 * Event start date with display conditions
 */
const eventStartDateField: INodeProperties = {
    ...startDateField,
    displayOptions: {
        show: {
            resource: ['event'],
            operation: ['create']
        }
    }
};

/**
 * Event state filter for getMany operation
 */
const eventStateField: INodeProperties = {
    displayName: 'Event State',
    name: 'eventState',
    type: 'options',
    options: [
        {
            name: 'Active',
            value: 'active'
        },
        {
            name: 'Draft',
            value: 'draft'
        },
        {
            name: 'Past',
            value: 'past'
        }
    ],
    default: 'active',
    description: 'Filter events by state (for getMany operation)'
};

/**
 * Event state field for update operations (state transitions)
 */
const eventUpdateStateField: INodeProperties = {
    displayName: 'Event State',
    name: 'state',
    type: 'options',
    options: [
        {
            name: 'Draft',
            value: 'draft'
        },
        {
            name: 'Active',
            value: 'active'
        },
        {
            name: 'Cancelled',
            value: 'cancelled'
        }
    ],
    default: 'active',
    description: 'Update the state of the event (draft, active, or cancelled)'
};

const seriesIdField: INodeProperties = {
    displayName: 'Series ID',
    name: 'seriesId',
    type: 'string',
    default: '',
    description: 'Filter events by series ID (for getMany operation)'
};

/**
 * Pagination cursor fields for getMany operation
 */
const eventAfterCursorField: INodeProperties = {
    ...afterCursorField,
    displayOptions: {
        show: {
            '/operation': ['getMany']
        }
    }
};

const eventBeforeCursorField: INodeProperties = {
    ...beforeCursorField,
    displayOptions: {
        show: {
            '/operation': ['getMany']
        }
    }
};

/**
 * Additional fields collection for events
 */
const eventAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['event'],
            operation: [
                'create',
                'update',
                'getMany',
                'get',
                'delete',
                'listCoupons',
                'createCoupon',
                'updateCoupon'
            ]
        }
    },
    options: [
        // Fields for getMany operation - after cursor
        eventAfterCursorField,
        // Fields for create/update operations
        approvalRequiredField,
        // Fields for getMany operation - before cursor
        eventBeforeCursorField,
        capacityField,
        // Fields for createCoupon operation
        {
            displayName: 'Description',
            name: 'description',
            type: 'string',
            displayOptions: {
                show: {
                    '/operation': ['createCoupon']
                }
            },
            default: '',
            description: 'Optional description for the coupon'
        },
        endDateField,
        // Fields for update operations - event name
        {
            displayName: 'Event Name',
            name: 'name',
            type: 'string',
            displayOptions: {
                show: {
                    '/operation': ['update']
                }
            },
            default: '',
            description: 'Update the name of the event'
        },
        eventStateField,
        {
            displayName: 'Expires At',
            name: 'expiresAt',
            type: 'dateTime',
            displayOptions: {
                show: {
                    '/operation': ['createCoupon']
                }
            },
            default: '',
            description:
                'When the coupon expires (leave empty for no expiration)'
        },
        // Fields for delete operation
        {
            ...forceDeleteField,
            displayOptions: {
                show: {
                    '/operation': ['delete']
                }
            }
        },
        // Fields for listCoupons operation
        {
            displayName: 'Include Inactive',
            name: 'includeInactive',
            type: 'boolean',
            displayOptions: {
                show: {
                    '/operation': ['listCoupons']
                }
            },
            default: false,
            description: 'Whether to include inactive coupons in the results'
        },
        {
            displayName: 'Include Usage Stats',
            name: 'includeUsageStats',
            type: 'boolean',
            displayOptions: {
                show: {
                    '/operation': ['listCoupons']
                }
            },
            default: true,
            description: 'Whether to include usage statistics for each coupon'
        },
        {
            displayName: 'Is Public',
            name: 'isPublic',
            type: 'boolean',
            displayOptions: {
                show: {
                    '/operation': ['createCoupon']
                }
            },
            default: true,
            description: 'Whether the coupon is public or private'
        },
        limitField,
        locationAddressField,
        locationNameField,
        locationTypeField,
        locationUrlField,
        {
            displayName: 'Max Uses',
            name: 'maxUses',
            type: 'number',
            displayOptions: {
                show: {
                    '/operation': ['createCoupon']
                }
            },
            typeOptions: {
                minValue: 1
            },
            default: '',
            description:
                'Maximum number of times the coupon can be used (leave empty for unlimited)'
        },
        {
            displayName: 'Max Uses Per User',
            name: 'maxUsesPerUser',
            type: 'number',
            displayOptions: {
                show: {
                    '/operation': ['createCoupon']
                }
            },
            typeOptions: {
                minValue: 1
            },
            default: '',
            description:
                'Maximum number of times one user can use the coupon (leave empty for unlimited)'
        },
        seriesIdField,
        {
            displayName: 'Sort By',
            name: 'sortBy',
            type: 'options',
            displayOptions: {
                show: {
                    '/operation': ['listCoupons']
                }
            },
            options: [
                {
                    name: 'Name',
                    value: 'name'
                },
                {
                    name: 'Created At',
                    value: 'created_at'
                },
                {
                    name: 'Expires At',
                    value: 'expires_at'
                },
                {
                    name: 'Usage',
                    value: 'usage'
                }
            ],
            default: 'created_at',
            description: 'Field to sort coupons by'
        },
        {
            displayName: 'Sort Order',
            name: 'sortOrder',
            type: 'options',
            displayOptions: {
                show: {
                    '/operation': ['listCoupons']
                }
            },
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
            default: 'desc',
            description: 'Sort order for the coupon list'
        },
        // Fields for update operations - start date
        {
            displayName: 'Start Date',
            name: 'startAt',
            type: 'dateTime',
            displayOptions: {
                show: {
                    '/operation': ['update']
                }
            },
            default: '',
            description: 'Update the start date and time of the event'
        },
        {
            displayName: 'Starts At',
            name: 'startsAt',
            type: 'dateTime',
            displayOptions: {
                show: {
                    '/operation': ['createCoupon']
                }
            },
            default: '',
            description:
                'When the coupon becomes valid (leave empty for immediate activation)'
        },
        eventUpdateStateField,
        timezoneField,
        // Fields for get operation
        {
            displayName: 'View',
            name: 'view',
            type: 'options',
            displayOptions: {
                show: {
                    '/operation': ['get']
                }
            },
            options: [
                {
                    name: 'Public',
                    value: 'public'
                },
                {
                    name: 'Admin',
                    value: 'admin'
                }
            ],
            default: 'public',
            description:
                'Choose between public view (excludes sensitive data) or admin view (includes private fields)'
        },
        visibilityField
    ]
};

/**
 * Update fields collection for updateCoupon operation
 */
const updateCouponFields: INodeProperties = {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['event'],
            operation: ['updateCoupon']
        }
    },
    options: [
        {
            displayName: 'Description',
            name: 'description',
            type: 'string',
            default: '',
            description: 'Updated coupon description'
        },
        {
            displayName: 'Expires At',
            name: 'expiresAt',
            type: 'dateTime',
            default: '',
            description: 'Updated expiration date (ISO 8601 format)'
        },
        {
            displayName: 'Is Active',
            name: 'isActive',
            type: 'boolean',
            default: true,
            description: 'Whether the coupon is active'
        },
        {
            displayName: 'Is Public',
            name: 'isPublic',
            type: 'boolean',
            default: true,
            description: 'Whether the coupon is public or private'
        },
        {
            displayName: 'Max Uses',
            name: 'maxUses',
            type: 'number',
            default: 0,
            description: 'Updated maximum number of uses (0 = unlimited)'
        },
        {
            displayName: 'Name',
            name: 'name',
            type: 'string',
            default: '',
            placeholder: 'New coupon name',
            description: 'Updated display name for the coupon'
        }
    ]
};

export const eventProps = [
    eventOperations,
    eventIdField,
    eventNameField,
    eventDescriptionField,
    eventStartDateField,
    couponNameField,
    couponCodeField,
    discountTypeField,
    discountValueField,
    couponIdField,
    eventAdditionalFields,
    updateCouponFields
];
