import type { INodeProperties } from 'n8n-workflow';

import { idField } from '../shared/props';

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
            name: 'List Events',
            value: 'listEvents',
            action: 'List events in a calendar',
            description: 'List events managed by a calendar'
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
            operation: ['listEvents', 'lookupEvent', 'addEvent']
        }
    },
    description: 'The API ID of the calendar'
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

export const calendarProps = [
    calendarOperations,
    calendarIdField,
    calendarApiIdField,
    addEventApiIdField,
    calendarAdditionalFields,
    lookupAdditionalFields,
    addEventAdditionalFields
];
