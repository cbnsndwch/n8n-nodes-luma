import type { INodeProperties } from 'n8n-workflow';

// Date and time related field definitions

export const startDateField: INodeProperties = {
    displayName: 'Start Date',
    name: 'startAt',
    type: 'dateTime',
    required: true,
    default: '',
    description: 'The start date and time of the event'
};

export const endDateField: INodeProperties = {
    displayName: 'End Date',
    name: 'endAt',
    type: 'dateTime',
    default: '',
    description: 'The end date and time of the event'
};

export const timezoneField: INodeProperties = {
    displayName: 'Timezone',
    name: 'timezone',
    type: 'string',
    default: 'UTC',
    description: 'The timezone for the event (e.g., America/New_York)'
};
