import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class Luma implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Luma',
    name: 'luma',
    icon: 'file:luma.svg',
    group: ['input'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Luma API',
    defaults: {
      name: 'Luma',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'lumaApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Event',
            value: 'event',
          },
        ],
        default: 'event',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['event'],
          },
        },
        options: [
          {
            name: 'Get',
            value: 'get',
            description: 'Get an event',
            action: 'Get an event',
          },
        ],
        default: 'get',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const resource = this.getNodeParameter('resource', i) as string;
      const operation = this.getNodeParameter('operation', i) as string;

      let responseData;

      if (resource === 'event') {
        if (operation === 'get') {
          // Implementation for getting an event
          responseData = { message: 'Event retrieved successfully' };
        }
      }

      returnData.push({
        json: responseData,
      });
    }

    return [returnData];
  }
}