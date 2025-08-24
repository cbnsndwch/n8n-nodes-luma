import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';

// Combined resource options for Luma node

const options = [
    {
        name: 'Event',
        value: 'event'
    },
    {
        name: 'Calendar',
        value: 'calendar'
    },
    {
        name: 'Guest',
        value: 'guest'
    },
    {
        name: 'User',
        value: 'user'
    },
    {
        name: 'Utility',
        value: 'utility'
    }
] as const;

export const lumaResource: INodeProperties = {
    displayName: 'Resource',
    name: 'resource',
    type: 'options',
    noDataExpression: true,
    options: options as any as INodePropertyOptions[],
    default: ''
};

export type ResourceId = (typeof options)[number]['value'];
