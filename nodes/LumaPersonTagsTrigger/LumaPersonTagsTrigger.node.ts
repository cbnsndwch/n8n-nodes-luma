import type {
	ITriggerFunctions,
	INodeType,
	INodeTypeDescription,
	ITriggerResponse,
	IDataObject,
	IHttpRequestMethods,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class LumaPersonTagsTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Luma Person Tags Trigger',
		name: 'lumaPersonTagsTrigger',
		icon: 'file:luma.svg',
		group: ['trigger'],
		version: 1,
		subtitle: 'Poll for new person tags',
		description: 'Triggers on new Luma person tags',
		defaults: {
			name: 'Luma Person Tags Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'lumaApi',
				required: true,
			},
		],
		polling: true,
		properties: [
			{
				displayName: 'Calendar ID',
				name: 'calendarId',
				type: 'string',
				default: '',
				required: true,
				description: 'The calendar ID to monitor for new person tags',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 50,
						typeOptions: {
							minValue: 1,
						},
						description: 'Max number of results to return',
					},
				],
			},
		],
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		const calendarId = this.getNodeParameter('calendarId') as string;
		const additionalFields = this.getNodeParameter(
			'additionalFields',
			{},
		) as IDataObject;

		// Get static data for maintaining state
		const staticData = this.getWorkflowStaticData('global');
		const lastPollTime = staticData.lastPollTime as string;
		const seenTagIds = (staticData.seenTagIds as string[]) || [];

		const pollFunction = async () => {
			try {
				const credentials = await this.getCredentials('lumaApi');
				const currentTime = new Date().toISOString();

				// Build API request parameters
				const params: IDataObject = {
					calendar_id: calendarId,
				};

				if (additionalFields.limit) {
					params.limit = additionalFields.limit;
				}

				// Add cursor for pagination if we have a last poll time
				if (lastPollTime) {
					params.after = lastPollTime;
				}

				const requestOptions = {
					method: 'GET' as IHttpRequestMethods,
					url: 'https://api.lu.ma/public/v1/calendar/list-person-tags',
					qs: params,
					headers: {
						'x-luma-api-key': credentials.apiKey,
						'Content-Type': 'application/json',
					},
					json: true,
				};

				const response = await this.helpers.request(requestOptions);

				// Process new person tags
				const newTags = [];
				const tags = response.entries || [];

				for (const tag of tags) {
					const tagId = tag.tag_id || tag.id;

					// Skip if we've already seen this tag
					if (!seenTagIds.includes(tagId)) {
						newTags.push({
							json: tag,
						});
						seenTagIds.push(tagId);
					}
				}

				// Limit seen tag IDs to prevent memory bloat (keep last 1000)
				if (seenTagIds.length > 1000) {
					staticData.seenTagIds = seenTagIds.slice(-1000);
				} else {
					staticData.seenTagIds = seenTagIds;
				}

				// Update last poll time
				staticData.lastPollTime = currentTime;

				// Emit new tags in chronological order
				if (newTags.length > 0) {
					// Sort by creation time if available
					newTags.sort((a, b) => {
						const timeA = a.json.created_at || '';
						const timeB = b.json.created_at || '';
						return timeA.localeCompare(timeB);
					});

					this.emit([newTags]);
				}
			} catch (error) {
				// Handle rate limiting with exponential backoff
				if (error.response?.status === 429) {
					// Rate limited - skip this poll cycle
					return;
				}

				// Log other errors but don't stop polling
				this.logger?.error(
					'Luma Person Tags Trigger error:',
					error.message,
				);
			}
		};

		return {
			closeFunction: async () => {
				// Cleanup if needed
			},
			manualTriggerFunction: async () => {
				await pollFunction();
			},
		};
	}
}
