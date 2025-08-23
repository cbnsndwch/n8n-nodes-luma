import type { INodePropertyOptions, INodeProperties } from 'n8n-workflow';

// Common field definitions used across multiple resources

export const idField = (
    displayName: string,
    name: string,
    description: string,
    showConditions: Record<string, string[]>
): INodeProperties => ({
    displayName,
    name,
    type: 'string',
    required: true,
    displayOptions: {
        show: showConditions
    },
    default: '',
    description
});

export const limitField: INodeProperties = {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: {
        minValue: 1
    },
    default: 50,
    description: 'Max number of results to return'
};

export const visibilityOptions: INodePropertyOptions[] = [
    {
        name: 'Public',
        value: 'public'
    },
    {
        name: 'Private',
        value: 'private'
    }
];

export const visibilityField: INodeProperties = {
    displayName: 'Visibility',
    name: 'visibility',
    type: 'options',
    options: visibilityOptions,
    default: 'public',
    description: 'The visibility of the event'
};

export const approvalRequiredField: INodeProperties = {
    displayName: 'Approval Required',
    name: 'approvalRequired',
    type: 'boolean',
    default: false,
    description: 'Whether approval is required for registrations'
};

export const capacityField: INodeProperties = {
    displayName: 'Capacity',
    name: 'capacity',
    type: 'number',
    default: '',
    description: 'Maximum number of attendees'
};

export const afterCursorField: INodeProperties = {
    displayName: 'After Cursor',
    name: 'after',
    type: 'string',
    default: '',
    description: 'Pagination cursor to get results after this point'
};

export const beforeCursorField: INodeProperties = {
    displayName: 'Before Cursor',
    name: 'before',
    type: 'string',
    default: '',
    description: 'Pagination cursor to get results before this point'
};
