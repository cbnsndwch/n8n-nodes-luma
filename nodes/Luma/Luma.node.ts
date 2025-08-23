import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

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
			name: 'Luma',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
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
						name: 'Get Many',
						value: 'getMany',
						action: 'Get many events',
					},
				],
				default: 'getMany',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			if (resource === 'event') {
				if (operation === 'getMany') {
					// Placeholder for getting events
					const responseData = {
						message:
							'Luma node is set up and ready for implementation',
						resource,
						operation,
					};

					returnData.push({
						json: responseData,
						pairedItem: { item: i },
					});
				}
			}
		}

		return [returnData];
	}
}
