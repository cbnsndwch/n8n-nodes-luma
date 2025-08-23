import type { INodeProperties } from 'n8n-workflow';

// Combined resource options for all Luma resources

export const combinedResource: INodeProperties = {
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
            name: 'Utility',
            value: 'utility'
        }
    ],
    default: 'event'
};
