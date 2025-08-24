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
                'importPeople',
                'listPeople',
                'listPersonTags',
                'deletePersonTag'
            ]
        }
    },
    description: 'The API ID of the calendar'
};

const tagApiIdField: INodeProperties = {
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

export const calendarProps = [
    calendarOperations,
    calendarIdField,
    calendarApiIdField,
    tagApiIdField,
    addEventApiIdField,
    peopleDataField,
    calendarAdditionalFields,
    lookupAdditionalFields,
    addEventAdditionalFields,
    importPeopleAdditionalFields,
    listPeopleAdditionalFields,
    listPersonTagsAdditionalFields,
    deletePersonTagAdditionalFields
];
