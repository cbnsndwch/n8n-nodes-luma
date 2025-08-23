import type {
    ITriggerFunctions,
    INodeType,
    INodeTypeDescription,
    ITriggerResponse,
    IDataObject,
    IHttpRequestMethods
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class LumaEventsTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Luma Events Trigger',
        name: 'lumaEventsTrigger',
        icon: 'file:luma.svg',
        group: ['trigger'],
        version: 1,
        subtitle: 'Poll for new events',
        description: 'Triggers on new Luma events',
        defaults: {
            name: 'Luma Events Trigger'
        },
        inputs: [],
        outputs: [NodeConnectionType.Main],
        credentials: [
            {
                name: 'lumaApi',
                required: true
            }
        ],
        polling: true,
        properties: [
            {
                displayName: 'Calendar ID',
                name: 'calendarId',
                type: 'string',
                default: '',
                required: true,
                description: 'The calendar ID to monitor for new events'
            },
            {
                displayName: 'Poll Mode',
                name: 'pollMode',
                type: 'options',
                options: [
                    {
                        name: 'Custom Cron',
                        value: 'cron'
                    },
                    {
                        name: 'Every 15 Minutes',
                        value: '15m'
                    },
                    {
                        name: 'Every 15 Seconds',
                        value: '15s'
                    },
                    {
                        name: 'Every 30 Seconds',
                        value: '30s'
                    },
                    {
                        name: 'Every 5 Minutes',
                        value: '5m'
                    },
                    {
                        name: 'Every Minute',
                        value: '1m'
                    }
                ],
                default: '1m',
                description: 'How often to poll for new events'
            },
            {
                displayName: 'Cron Expression',
                name: 'cronExpression',
                type: 'string',
                default: '*/5 * * * *',
                displayOptions: {
                    show: {
                        pollMode: ['cron']
                    }
                },
                description: 'Custom cron expression for polling frequency'
            },
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                options: [
                    {
                        displayName: 'Series ID',
                        name: 'seriesId',
                        type: 'string',
                        default: '',
                        description: 'Filter events by series ID'
                    },
                    {
                        displayName: 'Event State',
                        name: 'eventState',
                        type: 'options',
                        options: [
                            {
                                name: 'Active',
                                value: 'active'
                            },
                            {
                                name: 'Draft',
                                value: 'draft'
                            },
                            {
                                name: 'Past',
                                value: 'past'
                            }
                        ],
                        default: 'active',
                        description: 'Filter events by state'
                    },
                    {
                        displayName: 'Limit',
                        name: 'limit',
                        type: 'number',
                        default: 50,
                        typeOptions: {
                            minValue: 1
                        },
                        description: 'Max number of results to return'
                    }
                ]
            }
        ]
    };

    async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
        const calendarId = this.getNodeParameter('calendarId') as string;
        const additionalFields = this.getNodeParameter(
            'additionalFields',
            {}
        ) as IDataObject;

        // Get static data for maintaining state
        const staticData = this.getWorkflowStaticData('global');
        const lastPollTime = staticData.lastPollTime as string;
        const seenEventIds = (staticData.seenEventIds as string[]) || [];

        const pollFunction = async () => {
            try {
                const credentials = await this.getCredentials('lumaApi');
                const currentTime = new Date().toISOString();

                // Build API request parameters
                const params: IDataObject = {
                    calendar_id: calendarId
                };

                if (additionalFields.seriesId) {
                    params.series_id = additionalFields.seriesId;
                }
                if (additionalFields.eventState) {
                    params.event_state = additionalFields.eventState;
                }
                if (additionalFields.limit) {
                    params.limit = additionalFields.limit;
                }

                // Add cursor for pagination if we have a last poll time
                if (lastPollTime) {
                    params.after = lastPollTime;
                }

                const requestOptions = {
                    method: 'GET' as IHttpRequestMethods,
                    url: 'https://api.lu.ma/public/v1/calendar/list-events',
                    qs: params,
                    headers: {
                        'x-luma-api-key': credentials.apiKey,
                        'Content-Type': 'application/json'
                    },
                    json: true
                };

                const response = await this.helpers.request(requestOptions);

                // Process new events
                const newEvents = [];
                const events = response.entries || [];

                for (const event of events) {
                    const eventId = event.event_id || event.id;

                    // Skip if we've already seen this event
                    if (!seenEventIds.includes(eventId)) {
                        newEvents.push({
                            json: event
                        });
                        seenEventIds.push(eventId);
                    }
                }

                // Limit seen event IDs to prevent memory bloat (keep last 1000)
                if (seenEventIds.length > 1000) {
                    staticData.seenEventIds = seenEventIds.slice(-1000);
                } else {
                    staticData.seenEventIds = seenEventIds;
                }

                // Update last poll time
                staticData.lastPollTime = currentTime;

                // Emit new events in chronological order
                if (newEvents.length > 0) {
                    // Sort by creation time if available
                    newEvents.sort((a, b) => {
                        const timeA =
                            a.json.created_at || a.json.start_at || '';
                        const timeB =
                            b.json.created_at || b.json.start_at || '';
                        return timeA.localeCompare(timeB);
                    });

                    this.emit([newEvents]);
                }
            } catch (error) {
                // Handle rate limiting with exponential backoff
                if (error.response?.status === 429) {
                    // Rate limited - skip this poll cycle
                    return;
                }

                // Log other errors but don't stop polling
                this.logger?.error('Luma Events Trigger error:', error.message);
            }
        };

        return {
            closeFunction: async () => {
                // Cleanup if needed
            },
            manualTriggerFunction: async () => {
                await pollFunction();
            }
        };
    }
}
