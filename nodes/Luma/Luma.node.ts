import type {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import {
    eventOperations,
    eventIdField,
    calendarIdField,
    eventNameField,
    eventDescriptionField,
    eventStartDateField,
    eventAdditionalFields,
    userOperations,
    userAdditionalFields
} from './descriptions';
import { EventOperations, UserOperations } from './operations';

export class Luma implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Luma',
        name: 'luma',
        icon: 'file:luma.svg',
        group: ['output'],
        version: 1,
        subtitle:
            '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Consume Luma API',
        defaults: {
            name: 'Luma'
        },
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
        credentials: [
            {
                name: 'lumaApi',
                required: true
            }
        ],
        properties: [
            // Combined resource selection
            {
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
                        name: 'User',
                        value: 'user'
                    }
                ],
                default: 'event'
            },
            // Event operations
            eventOperations,
            // User operations
            userOperations,
            // Event-specific fields
            eventIdField,
            calendarIdField,
            eventNameField,
            eventDescriptionField,
            eventStartDateField,
            eventAdditionalFields,
            // User-specific fields
            userAdditionalFields
        ]
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);

        for (let i = 0; i < items.length; i++) {
            try {
                if (resource === 'event') {
                    const context = {
                        executeFunctions: this,
                        itemIndex: i
                    };

                    let result: INodeExecutionData | INodeExecutionData[];

                    switch (operation) {
                        case 'get':
                            result = await EventOperations.get(context);
                            break;
                        case 'getMany':
                            result = await EventOperations.getMany(context);
                            break;
                        case 'create':
                            result = await EventOperations.create(context);
                            break;
                        case 'update':
                            result = await EventOperations.update(context);
                            break;
                        case 'delete':
                            result = await EventOperations.delete(context);
                            break;
                        default:
                            throw new NodeOperationError(
                                this.getNode(),
                                `The operation "${operation}" is not supported!`
                            );
                    }

                    // Handle single vs multiple results
                    if (Array.isArray(result)) {
                        returnData.push(...result);
                    } else {
                        returnData.push(result);
                    }
                } else if (resource === 'user') {
                    const context = {
                        executeFunctions: this,
                        itemIndex: i
                    };

                    let result: INodeExecutionData;

                    switch (operation) {
                        case 'getSelf':
                            result = await UserOperations.getSelf(context);
                            break;
                        default:
                            throw new NodeOperationError(
                                this.getNode(),
                                `The operation "${operation}" is not supported for user resource!`
                            );
                    }

                    returnData.push(result);
                } else {
                    throw new NodeOperationError(
                        this.getNode(),
                        `The resource "${resource}" is not supported!`
                    );
                }
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: { error: error.message },
                        pairedItem: { item: i }
                    });
                    continue;
                }
                throw error;
            }
        }

        return [returnData];
    }
}
