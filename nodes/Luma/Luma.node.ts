import {
    type IExecuteFunctions,
    type INodeExecutionData,
    type INodeType,
    type INodeTypeDescription,
    NodeConnectionType,
    NodeOperationError
} from 'n8n-workflow';

import { lumaResource, type ResourceId } from './shared/props';

import { calendarProps } from './calendar/props';
import { eventProps } from './event/props';
import { userProps } from './user/props';
import { utilityProps } from './utility/props';

import { RESOURCE_HANDLERS } from './operations';

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
            lumaResource,
            ...eventProps,
            ...calendarProps,
            ...userProps,
            ...utilityProps
        ]
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0);

        for (let i = 0; i < items.length; i++) {
            try {
                const context = {
                    executeFunctions: this,
                    itemIndex: i
                };

                const handleOperation =
                    RESOURCE_HANDLERS[resource as ResourceId];

                if (!handleOperation) {
                    throw new NodeOperationError(
                        this.getNode(),
                        `The resource "${resource}" is not supported!`
                    );
                }

                const result = await handleOperation(operation, context);

                // Handle single vs multiple results
                if (Array.isArray(result)) {
                    returnData.push(...result);
                } else {
                    returnData.push(result);
                }
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message
                        },
                        pairedItem: {
                            item: i
                        }
                    });
                    continue;
                }
                throw error;
            }
        }

        return [returnData];
    }
}
