import {
    type IExecuteFunctions,
    type INodeExecutionData,
    type INodeType,
    type INodeTypeDescription,
    NodeConnectionType,
    NodeOperationError
} from 'n8n-workflow';

import { lumaResource, ResourceId } from './shared/props';

import {
    calendarOperations,
    calendarApiIdField,
    calendarAdditionalFields
} from './calendar/props';

import {
    eventOperations,
    eventIdField,
    calendarIdField,
    eventNameField,
    eventDescriptionField,
    eventStartDateField,
    eventAdditionalFields
} from './event/props';

import { userOperations, userAdditionalFields } from './user/props';

import {
    imageTypeField,
    utilityOperations,
    utilityAdditionalFields
} from './utility/props';
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
            // Event-specific fields
            eventOperations,
            eventIdField,
            eventNameField,
            eventDescriptionField,
            eventStartDateField,
            eventAdditionalFields,
            // Calendar-specific fields
            calendarOperations,
            calendarIdField,
            calendarApiIdField,
            calendarAdditionalFields,
            // User-specific fields
            userOperations,
            userAdditionalFields,
            // Utility-specific fields
            utilityOperations,
            imageTypeField,
            utilityAdditionalFields
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
