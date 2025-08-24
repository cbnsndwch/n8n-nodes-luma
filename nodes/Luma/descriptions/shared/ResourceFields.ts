import type { INodeProperties } from 'n8n-workflow';

// Combined resource options for Luma node

export const lumaResource: INodeProperties = {
    displayName: 'Resource',
    name: 'resource',
    type: 'options',
    noDataExpression: true,
    options: [
        {
            name: 'Event',
            value: 'event'
        },
        {
            name: 'Calendar',
            value: 'calendar'
        }
    ],
    default: 'event'
};
