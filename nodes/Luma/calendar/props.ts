import type { INodeProperties } from 'n8n-workflow';

import { idField } from '../shared/props';
import { forceDeleteField } from '../shared/props/common.props';

const calendarIdField = idField(
    'Calendar ID',
    'calendarId',
    'The ID of the calendar',
    {
        resource: ['event'],
        operation: ['getMany', 'create']
    }
);

const calendarOperations: INodeProperties = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
        show: {
            resource: ['calendar']
        }
    },
    options: [
        {
            name: 'Add Event',
            value: 'addEvent',
            action: 'Add an event to a calendar',
            description: 'Add an existing event to a calendar'
        },
        {
            name: 'Create Coupon',
            value: 'createCoupon',
            action: 'Create a coupon for calendar events',
            description: 'Create a new coupon for calendar events'
        },
        {
            name: 'Create Person Tag',
            value: 'createPersonTag',
            action: 'Create a person tag in a calendar',
            description: 'Create a new person tag for organizing people'
        },
        {
            name: 'Delete Person Tag',
            value: 'deletePersonTag',
            action: 'Delete a person tag from a calendar',
            description: 'Delete a person tag that is no longer needed'
        },
        {
            name: 'Import People',
            value: 'importPeople',
            action: 'Import people to a calendar',
            description: 'Import multiple people to a calendar in bulk'
        },
        {
            name: 'List Coupons',
            value: 'listCoupons',
            action: 'List coupons in a calendar',
            description: 'List discount coupons available for calendar events'
        },
        {
            name: 'List Events',
            value: 'listEvents',
            action: 'List events in a calendar',
            description: 'List events managed by a calendar'
        },
        {
            name: 'List People',
            value: 'listPeople',
            action: 'List people in a calendar',
            description: 'List people associated with a calendar'
        },
        {
            name: 'List Person Tags',
            value: 'listPersonTags',
            action: 'List person tags in a calendar',
            description: 'List person tags for calendar organization'
        },
        {
            name: 'Lookup Event',
            value: 'lookupEvent',
            action: 'Lookup a specific event in a calendar',
            description: 'Check if an event exists in a calendar'
        },
        {
            name: 'Update Coupon',
            value: 'updateCoupon',
            action: 'Update a calendar coupon',
            description: 'Update existing coupon settings for a calendar'
        },
        {
            name: 'Update Person Tag',
            value: 'updatePersonTag',
            action: 'Update a person tag in a calendar',
            description: 'Update the properties of an existing person tag'
        }
    ],
    default: 'listEvents'
};

// Calendar-specific required fields

const calendarApiIdField: INodeProperties = {
    displayName: 'Calendar API ID',
    name: 'calendarApiId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: [
                'listEvents',
                'lookupEvent',
                'addEvent',
                'createCoupon',
                'importPeople',
                'listPeople',
                'listPersonTags',
                'listCoupons',
                'updatePersonTag',
                'deletePersonTag',
                'createPersonTag',
                'updateCoupon'
            ]
        }
    },
    description: 'The API ID of the calendar'
};

const deleteTagApiIdField: INodeProperties = {
    displayName: 'Tag API ID',
    name: 'tagApiId',
    type: 'string',
    required: true,
    default: '',
    placeholder: 'tag_123abc...',
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['deletePersonTag']
        }
    },
    description: 'The API ID of the person tag to delete'
};

// Time range filter fields for calendar events

const beforeDateField: INodeProperties = {
    displayName: 'Before Date',
    name: 'before',
    type: 'dateTime',
    default: '',
    description: 'Filter events before this time (ISO 8601 datetime)'
};

const afterDateField: INodeProperties = {
    displayName: 'After Date',
    name: 'after',
    type: 'dateTime',
    default: '',
    description: 'Filter events after this time (ISO 8601 datetime)'
};

const sortDirectionField: INodeProperties = {
    displayName: 'Sort Direction',
    name: 'sortDirection',
    type: 'options',
    options: [
        {
            name: 'Ascending',
            value: 'asc'
        },
        {
            name: 'Descending',
            value: 'desc'
        },
        {
            name: 'Ascending (Nulls Last)',
            value: 'asc nulls last'
        },
        {
            name: 'Descending (Nulls Last)',
            value: 'desc nulls last'
        }
    ],
    default: 'asc',
    description: 'Sort direction for results'
};

const sortColumnField: INodeProperties = {
    displayName: 'Sort Column',
    name: 'sortColumn',
    type: 'options',
    options: [
        {
            name: 'Start Date',
            value: 'start_at'
        }
    ],
    default: 'start_at',
    description: 'Column to sort by'
};

const paginationCursorField: INodeProperties = {
    displayName: 'Pagination Cursor',
    name: 'paginationCursor',
    type: 'string',
    default: '',
    description: 'Cursor for pagination through results'
};

const paginationLimitField: INodeProperties = {
    displayName: 'Pagination Limit',
    name: 'paginationLimit',
    type: 'number',
    default: 50,
    description: 'Number of items to return (max 100)',
    typeOptions: {
        minValue: 1,
        maxValue: 100
    }
};

// Calendar additional fields for listEvents operation
const calendarAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['listEvents']
        }
    },
    options: [
        beforeDateField,
        afterDateField,
        sortDirectionField,
        sortColumnField,
        paginationCursorField,
        paginationLimitField
    ]
};

// Lookup Event specific fields

const platformField: INodeProperties = {
    displayName: 'Platform',
    name: 'platform',
    type: 'options',
    default: 'luma',
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['lookupEvent']
        }
    },
    options: [
        {
            name: 'Luma',
            value: 'luma'
        },
        {
            name: 'External',
            value: 'external'
        }
    ],
    description: 'Platform type to search within'
};

const eventUrlField: INodeProperties = {
    displayName: 'Event URL',
    name: 'url',
    type: 'string',
    default: '',
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['lookupEvent']
        }
    },
    description: 'Event URL to lookup'
};

const eventApiIdField: INodeProperties = {
    displayName: 'Event API ID',
    name: 'eventApiId',
    type: 'string',
    default: '',
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['lookupEvent']
        }
    },
    description: 'Event API ID to lookup'
};

const lookupAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['lookupEvent']
        }
    },
    options: [platformField, eventUrlField, eventApiIdField]
};

// Add Event specific fields

const addEventApiIdField: INodeProperties = {
    displayName: 'Event API ID',
    name: 'eventApiId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['addEvent']
        }
    },
    description: 'The API ID of the event to add to the calendar'
};

// Update Person Tag specific fields

const updateTagApiIdField: INodeProperties = {
    displayName: 'Tag API ID',
    name: 'tagApiId',
    type: 'string',
    required: true,
    default: '',
    placeholder: 'tag_123abc...',
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['updatePersonTag']
        }
    },
    description: 'API ID of the person tag to update'
};

const roleField: INodeProperties = {
    displayName: 'Role',
    name: 'role',
    type: 'options',
    options: [
        {
            name: 'Host',
            value: 'host'
        },
        {
            name: 'Co-Host',
            value: 'co-host'
        },
        {
            name: 'Organizer',
            value: 'organizer'
        }
    ],
    default: 'host',
    description: 'Role for the event association'
};

const addEventAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['addEvent']
        }
    },
    options: [roleField]
};

// Import People specific fields

const peopleDataField: INodeProperties = {
    displayName: 'People',
    name: 'people',
    type: 'fixedCollection',
    required: true,
    typeOptions: {
        multipleValues: true
    },
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['importPeople']
        }
    },
    default: {},
    description: 'List of people to import to the calendar',
    options: [
        {
            name: 'person',
            displayName: 'Person',
            values: [
                {
                    displayName: 'Email',
                    name: 'email',
                    type: 'string',
                    required: true,
                    placeholder: 'user@example.com',
                    default: '',
                    description: 'Email address of the person (required)'
                },
                {
                    displayName: 'Name',
                    name: 'name',
                    type: 'string',
                    default: '',
                    description: 'Display name of the person'
                },
                {
                    displayName: 'Role',
                    name: 'role',
                    type: 'options',
                    options: [
                        {
                            name: 'Admin',
                            value: 'admin'
                        },
                        {
                            name: 'Member',
                            value: 'member'
                        },
                        {
                            name: 'Follower',
                            value: 'follower'
                        }
                    ],
                    default: 'member',
                    description: 'Role for the person in the calendar'
                },
                {
                    displayName: 'Tags',
                    name: 'tags',
                    type: 'string',
                    default: '',
                    description: 'Comma-separated list of tags for the person'
                }
            ]
        }
    ]
};

const defaultRoleField: INodeProperties = {
    displayName: 'Default Role',
    name: 'defaultRole',
    type: 'options',
    options: [
        {
            name: 'Admin',
            value: 'admin'
        },
        {
            name: 'Member',
            value: 'member'
        },
        {
            name: 'Follower',
            value: 'follower'
        }
    ],
    default: 'member',
    description: 'Default role for people who do not have a role specified'
};

const skipDuplicatesField: INodeProperties = {
    displayName: 'Skip Duplicates',
    name: 'skipDuplicates',
    type: 'boolean',
    default: true,
    description: 'Whether to skip people with duplicate email addresses'
};

const notifyUsersField: INodeProperties = {
    displayName: 'Notify Users',
    name: 'notifyUsers',
    type: 'boolean',
    default: false,
    description: 'Whether to send notification emails to imported users'
};

const importPeopleAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['importPeople']
        }
    },
    options: [defaultRoleField, skipDuplicatesField, notifyUsersField]
};

// Create Coupon specific fields

const couponNameField: INodeProperties = {
    displayName: 'Coupon Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    placeholder: 'Enter coupon name',
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['createCoupon']
        }
    },
    description: 'Display name for the coupon'
};

const couponCodeField: INodeProperties = {
    displayName: 'Coupon Code',
    name: 'code',
    type: 'string',
    required: true,
    default: '',
    placeholder: 'SAVE20',
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['createCoupon']
        }
    },
    description: 'Unique coupon code that users will enter'
};

const discountTypeField: INodeProperties = {
    displayName: 'Discount Type',
    name: 'discountType',
    type: 'options',
    required: true,
    default: 'percentage',
    options: [
        { name: 'Percentage', value: 'percentage' },
        { name: 'Fixed Amount', value: 'fixed_amount' }
    ],
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['createCoupon']
        }
    },
    description: 'Type of discount to apply'
};

const discountValueField: INodeProperties = {
    displayName: 'Discount Value',
    name: 'discountValue',
    type: 'number',
    required: true,
    default: 10,
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['createCoupon']
        }
    },
    description: 'Discount amount (percentage 0-100 or cents for fixed amount)'
};

const createCouponAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['createCoupon']
        }
    },
    options: [
        {
            displayName: 'Max Uses',
            name: 'maxUses',
            type: 'number',
            default: '',
            description: 'Maximum number of uses (unlimited if not set)',
            typeOptions: {
                minValue: 1
            }
        },
        {
            displayName: 'Expires At',
            name: 'expiresAt',
            type: 'dateTime',
            default: '',
            description: 'Expiration date (ISO 8601 format)'
        },
        {
            displayName: 'Description',
            name: 'description',
            type: 'string',
            default: '',
            description: 'Optional description for the coupon'
        },
        {
            displayName: 'Is Active',
            name: 'isActive',
            type: 'boolean',
            default: true,
            description: 'Whether coupon is active'
        }
    ]
};

// List People specific fields

const queryField: INodeProperties = {
    displayName: 'Search Query',
    name: 'query',
    type: 'string',
    default: '',
    placeholder: 'Search over names and emails',
    description: 'Search filter for people names and emails'
};

const membershipTierField: INodeProperties = {
    displayName: 'Membership Tier API ID',
    name: 'membershipTierApiId',
    type: 'string',
    default: '',
    description: 'Filter by membership tier API ID'
};

const memberStatusField: INodeProperties = {
    displayName: 'Member Status',
    name: 'memberStatus',
    type: 'string',
    default: '',
    description: 'Filter by member status (relevant for Calendar Memberships)'
};

const peopleSortColumnField: INodeProperties = {
    displayName: 'Sort Column',
    name: 'sortColumn',
    type: 'options',
    options: [
        {
            name: 'Approved Count',
            value: 'event_approved_count'
        },
        {
            name: 'Check-in Count',
            value: 'event_checked_in_count'
        },
        {
            name: 'Created At',
            value: 'created_at'
        },
        {
            name: 'Name',
            value: 'name'
        },
        {
            name: 'Revenue',
            value: 'revenue_usd_cents'
        }
    ],
    default: 'created_at',
    description: 'Column to sort by'
};

const listPeopleAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['listPeople']
        }
    },
    options: [
        queryField,
        membershipTierField,
        memberStatusField,
        sortDirectionField,
        peopleSortColumnField,
        paginationCursorField,
        paginationLimitField
    ]
};

// Additional fields for listPersonTags operation
const listPersonTagsAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['listPersonTags']
        }
    },
    options: [paginationCursorField, paginationLimitField]
};

// Additional fields for listCoupons operation
const listCouponsAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['listCoupons']
        }
    },
    options: [paginationCursorField, paginationLimitField]
};

// Update fields for updatePersonTag operation
const updatePersonTagFields: INodeProperties = {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['updatePersonTag']
        }
    },
    options: [
        {
            displayName: 'Name',
            name: 'name',
            type: 'string',
            default: '',
            placeholder: 'Updated tag name',
            description: 'Updated name for the tag'
        },
        {
            displayName: 'Color',
            name: 'color',
            type: 'color',
            default: '',
            placeholder: '#FF5733',
            description: 'Updated hex color code for the tag (e.g., #FF5733)'
        },
        {
            displayName: 'Description',
            name: 'description',
            type: 'string',
            default: '',
            placeholder: 'Updated tag description',
            description: 'Updated description for the tag'
        }
    ]
};

// Additional fields for deletePersonTag operation
const deletePersonTagAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['deletePersonTag']
        }
    },
    options: [
        {
            ...forceDeleteField,
            displayName: 'Force Delete',
            name: 'forceDelete',
            description: 'Force deletion even if tag is assigned to people'
        }
    ]
};

// Create Person Tag specific fields

const personTagNameField: INodeProperties = {
    displayName: 'Tag Name',
    name: 'name',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['createPersonTag']
        }
    },
    description: 'Name of the person tag (required)'
};

const createPersonTagAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['createPersonTag']
        }
    },
    options: [
        {
            displayName: 'Color',
            name: 'color',
            type: 'color',
            default: '',
            placeholder: '#FF5733',
            description: 'Color for the tag (hex color code)'
        },
        {
            displayName: 'Description',
            name: 'description',
            type: 'string',
            default: '',
            placeholder: 'Tag description',
            description: 'Optional description for the tag'
        }
    ]
};

// Update Coupon specific fields

const couponApiIdField: INodeProperties = {
    displayName: 'Coupon ID',
    name: 'apiId',
    type: 'string',
    required: true,
    default: '',
    placeholder: 'coupon_123abc...',
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['updateCoupon']
        }
    },
    description: 'API ID of the coupon to update'
};

const updateCouponFields: INodeProperties = {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['updateCoupon']
        }
    },
    options: [
        {
            displayName: 'Code',
            name: 'code',
            type: 'string',
            default: '',
            placeholder: 'NEW_CODE',
            description: 'Updated coupon code'
        },
        {
            displayName: 'Description',
            name: 'description',
            type: 'string',
            default: '',
            description: 'Updated coupon description'
        },
        {
            displayName: 'Discount Type',
            name: 'discountType',
            type: 'options',
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
            description: 'Updated discount type'
        },
        {
            displayName: 'Discount Value',
            name: 'discountValue',
            type: 'number',
            default: 0,
            description:
                'Updated discount value (percentage: 0-100, fixed amount: cents)'
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

export const calendarProps = [
    calendarOperations,
    calendarIdField,
    calendarApiIdField,
    deleteTagApiIdField,
    addEventApiIdField,
    updateTagApiIdField,
    couponApiIdField,
    peopleDataField,
    personTagNameField,
    couponNameField,
    couponCodeField,
    discountTypeField,
    discountValueField,
    calendarAdditionalFields,
    lookupAdditionalFields,
    addEventAdditionalFields,
    importPeopleAdditionalFields,
    createCouponAdditionalFields,
    listPeopleAdditionalFields,
    listPersonTagsAdditionalFields,
    listCouponsAdditionalFields,
    updatePersonTagFields,
    deletePersonTagAdditionalFields,
    createPersonTagAdditionalFields,
    updateCouponFields
];
