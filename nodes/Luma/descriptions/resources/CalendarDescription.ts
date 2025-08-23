import type { INodeProperties } from 'n8n-workflow';

// Calendar resource parameter descriptions

export const calendarResource: INodeProperties = {
    displayName: 'Resource',
    name: 'resource',
    type: 'options',
    noDataExpression: true,
    options: [
        {
            name: 'Calendar',
            value: 'calendar'
        }
    ],
    default: 'calendar'
};

export const calendarOperations: INodeProperties = {
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
            name: 'List Events',
            value: 'listEvents',
            action: 'List events in a calendar',
            description: 'List events managed by a calendar'
        }
    ],
    default: 'listEvents'
};

// Calendar-specific required fields

export const calendarApiIdField: INodeProperties = {
    displayName: 'Calendar API ID',
    name: 'calendarApiId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
        show: {
            resource: ['calendar'],
            operation: ['listEvents']
        }
    },
    description: 'The API ID of the calendar'
};

// Time range filter fields for calendar events

export const beforeDateField: INodeProperties = {
    displayName: 'Before Date',
    name: 'before',
    type: 'dateTime',
    default: '',
    description: 'Filter events before this time (ISO 8601 datetime)'
};

export const afterDateField: INodeProperties = {
    displayName: 'After Date',
    name: 'after',
    type: 'dateTime',
    default: '',
    description: 'Filter events after this time (ISO 8601 datetime)'
};

export const sortDirectionField: INodeProperties = {
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

export const sortColumnField: INodeProperties = {
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

export const paginationCursorField: INodeProperties = {
    displayName: 'Pagination Cursor',
    name: 'paginationCursor',
    type: 'string',
    default: '',
    description: 'Cursor for pagination through results'
};

export const paginationLimitField: INodeProperties = {
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
export const calendarAdditionalFields: INodeProperties = {
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
