import type {
    ITriggerFunctions,
    INodeType,
    INodeTypeDescription,
    ITriggerResponse,
    IDataObject,
    IHttpRequestMethods
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class LumaEventGuestsTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Luma Event Guests Trigger',
        name: 'lumaEventGuestsTrigger',
        icon: 'file:luma.svg',
        group: ['trigger'],
        version: 1,
        subtitle: 'Poll for new event guests',
        description: 'Triggers on new Luma event guests',
        defaults: {
            name: 'Luma Event Guests Trigger'
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
                displayName: 'Event ID',
                name: 'eventId',
                type: 'string',
                default: '',
                required: true,
                description: 'The event ID to monitor for new guests'
            },
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                options: [
                    {
                        displayName: 'Approval Status',
                        name: 'approvalStatus',
                        type: 'options',
                        options: [
                            {
                                name: 'Approved',
                                value: 'approved'
                            },
                            {
                                name: 'Pending',
                                value: 'pending'
                            },
                            {
                                name: 'Rejected',
                                value: 'rejected'
                            }
                        ],
                        default: 'approved',
                        description: 'Filter guests by approval status'
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
        const eventId = this.getNodeParameter('eventId') as string;
        const additionalFields = this.getNodeParameter(
            'additionalFields',
            {}
        ) as IDataObject;

        // Get static data for maintaining state
        const staticData = this.getWorkflowStaticData('global');
        const lastPollTime = staticData.lastPollTime as string;
        const seenGuestIds = (staticData.seenGuestIds as string[]) || [];

        const pollFunction = async () => {
            try {
                const credentials = await this.getCredentials('lumaApi');
                const currentTime = new Date().toISOString();

                // Build API request parameters
                const params: IDataObject = {
                    event_id: eventId
                };

                if (additionalFields.approvalStatus) {
                    params.approval_status = additionalFields.approvalStatus;
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
                    url: 'https://api.lu.ma/public/v1/event/get-guests',
                    qs: params,
                    headers: {
                        'x-luma-api-key': credentials.apiKey,
                        'Content-Type': 'application/json'
                    },
                    json: true
                };

                const response = await this.helpers.request(requestOptions);

                // Process new guests
                const newGuests = [];
                const guests = response.entries || [];

                for (const guest of guests) {
                    const guestId = guest.guest_id || guest.id;

                    // Skip if we've already seen this guest
                    if (!seenGuestIds.includes(guestId)) {
                        newGuests.push({
                            json: guest
                        });
                        seenGuestIds.push(guestId);
                    }
                }

                // Limit seen guest IDs to prevent memory bloat (keep last 1000)
                if (seenGuestIds.length > 1000) {
                    staticData.seenGuestIds = seenGuestIds.slice(-1000);
                } else {
                    staticData.seenGuestIds = seenGuestIds;
                }

                // Update last poll time
                staticData.lastPollTime = currentTime;

                // Emit new guests in chronological order
                if (newGuests.length > 0) {
                    // Sort by creation time if available
                    newGuests.sort((a, b) => {
                        const timeA =
                            a.json.created_at || a.json.registered_at || '';
                        const timeB =
                            b.json.created_at || b.json.registered_at || '';
                        return timeA.localeCompare(timeB);
                    });

                    this.emit([newGuests]);
                }
            } catch (error) {
                // Handle rate limiting with exponential backoff
                if (error.response?.status === 429) {
                    // Rate limited - skip this poll cycle
                    return;
                }

                // Log other errors but don't stop polling
                this.logger?.error(
                    'Luma Event Guests Trigger error:',
                    error.message
                );
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
