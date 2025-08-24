import type { INodeProperties } from 'n8n-workflow';

// User resource parameter descriptions

const userResource: INodeProperties = {
    displayName: 'Resource',
    name: 'resource',
    type: 'options',
    noDataExpression: true,
    options: [
        {
            name: 'User',
            value: 'user'
        }
    ],
    default: 'user'
};

const userOperations: INodeProperties = {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
        show: {
            resource: ['user']
        }
    },
    options: [
        {
            name: 'Get Self',
            value: 'getSelf',
            action: 'Get authenticated user information'
        }
    ],
    default: 'getSelf'
};

// No additional fields needed for getSelf operation
const userAdditionalFields: INodeProperties = {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
        show: {
            resource: ['user'],
            operation: ['getSelf']
        }
    },
    options: [
        // No additional options needed for getSelf operation
        // The API endpoint requires no parameters beyond authentication
    ]
};

export const userProps = [userResource, userOperations, userAdditionalFields];
