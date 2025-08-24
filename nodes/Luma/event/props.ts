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

// Event resource parameter descriptions

export const eventResource: INodeProperties = {
    displayName: 'Resource',
    name: 'resource',
    type: 'options',
    noDataExpression: true,
    options: [
        {
            name: 'Event',
            value: 'event'
        }
    ],
    default: 'event'
};

export const eventOperations: INodeProperties = {
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
            name: 'List Events',
            value: 'getMany',
            action: 'Get many events'
        },
        {
            name: 'Update',
            value: 'update',
            action: 'Update an event'
        }
    ],
    default: 'get'
};

// Event-specific required fields
export const eventIdField = idField(
    'Event ID',
    'eventId',
    'The ID of the event',
    {
        resource: ['event'],
        operation: ['get', 'update', 'delete']
    }
);

export const calendarIdField = idField(
    'Calendar ID',
    'calendarId',
    'The ID of the calendar',
    {
        resource: ['event'],
        operation: ['getMany', 'create']
    }
);

export const eventNameField: INodeProperties = {
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

export const eventDescriptionField: INodeProperties = {
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

// Event start date with display conditions
export const eventStartDateField: INodeProperties = {
    ...startDateField,
    displayOptions: {
        show: {
            resource: ['event'],
            operation: ['create']
        }
    }
};

// Event state filter for getMany operation
export const eventStateField: INodeProperties = {
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

// Event state field for update operations (state transitions)
export const eventUpdateStateField: INodeProperties = {
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

export const seriesIdField: INodeProperties = {
    displayName: 'Series ID',
    name: 'seriesId',
    type: 'string',
    default: '',
    description: 'Filter events by series ID (for getMany operation)'
};

// Pagination cursor fields for getMany operation
export const eventAfterCursorField: INodeProperties = {
    ...afterCursorField,
    displayOptions: {
        show: {
            '/operation': ['getMany']
        }
    }
};

export const eventBeforeCursorField: INodeProperties = {
    ...beforeCursorField,
    displayOptions: {
        show: {
            '/operation': ['getMany']
        }
    }
};

// Additional fields collection for events
export const eventAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['event'],
            operation: ['create', 'update', 'getMany', 'get', 'delete']
        }
    },
    options: [
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
        // Fields for delete operation
        {
            ...forceDeleteField,
            displayOptions: {
                show: {
                    '/operation': ['delete']
                }
            }
        },
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
        // Fields for create/update operations
        approvalRequiredField,
        capacityField,
        endDateField,
        eventUpdateStateField,
        locationAddressField,
        locationNameField,
        locationTypeField,
        locationUrlField,
        timezoneField,
        visibilityField,
        // Fields for getMany operation
        eventStateField,
        limitField,
        seriesIdField,
        eventAfterCursorField,
        eventBeforeCursorField
    ]
};
