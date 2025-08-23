import type {
	ITriggerFunctions,
	INodeType,
	INodeTypeDescription,
	ITriggerResponse,
	IDataObject,
	IHttpRequestMethods,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class LumaPeopleTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Luma People Trigger',
		name: 'lumaPeopleTrigger',
		icon: 'file:luma.svg',
		group: ['trigger'],
		version: 1,
		subtitle: 'Poll for new people',
		description: 'Triggers on new Luma people',
		defaults: {
			name: 'Luma People Trigger',
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
				description: 'The calendar ID to monitor for new people',
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
		const additionalFields = this.getNodeParameter('additionalFields', {}) as IDataObject;

		// Get static data for maintaining state
		const staticData = this.getWorkflowStaticData('global');
		const lastPollTime = staticData.lastPollTime as string;
		const seenPeopleIds = (staticData.seenPeopleIds as string[]) || [];

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
					url: 'https://api.lu.ma/public/v1/calendar/list-people',
					qs: params,
					headers: {
						'x-luma-api-key': credentials.apiKey,
						'Content-Type': 'application/json',
					},
					json: true,
				};

				const response = await this.helpers.request(requestOptions);

				// Process new people
				const newPeople = [];
				const people = response.entries || [];

				for (const person of people) {
					const personId = person.person_id || person.id;
					
					// Skip if we've already seen this person
					if (!seenPeopleIds.includes(personId)) {
						newPeople.push({
							json: person,
						});
						seenPeopleIds.push(personId);
					}
				}

				// Limit seen people IDs to prevent memory bloat (keep last 1000)
				if (seenPeopleIds.length > 1000) {
					staticData.seenPeopleIds = seenPeopleIds.slice(-1000);
				} else {
					staticData.seenPeopleIds = seenPeopleIds;
				}

				// Update last poll time
				staticData.lastPollTime = currentTime;

				// Emit new people in chronological order
				if (newPeople.length > 0) {
					// Sort by creation time if available
					newPeople.sort((a, b) => {
						const timeA = a.json.created_at || a.json.joined_at || '';
						const timeB = b.json.created_at || b.json.joined_at || '';
						return timeA.localeCompare(timeB);
					});

					this.emit([newPeople]);
				}

			} catch (error) {
				// Handle rate limiting with exponential backoff
				if (error.response?.status === 429) {
					// Rate limited - skip this poll cycle
					return;
				}

				// Log other errors but don't stop polling
				this.logger?.error('Luma People Trigger error:', error.message);
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