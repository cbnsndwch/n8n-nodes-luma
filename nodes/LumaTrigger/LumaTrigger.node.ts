import type {
    ITriggerFunctions,
    INodeType,
    INodeTypeDescription,
    ITriggerResponse,
    IDataObject,
    IHttpRequestMethods
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import { buildLumaApiUrl, LUMA_ENDPOINTS } from '../Luma/utils/constants';

export class LumaTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Luma Trigger',
        name: 'lumaTrigger',
        icon: 'file:luma.svg',
        group: ['trigger'],
        version: 1,
        subtitle:
            '={{$parameter["events"].length === 1 ? "Polling for " + $parameter["events"][0] : "Polling for " + $parameter["events"].length + " event types"}}',
        description:
            'Triggers on new Luma events, guests, people, tags, and coupons',
        defaults: {
            name: 'Luma Trigger'
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
                displayName: 'Events to Monitor',
                name: 'events',
                type: 'multiOptions',
                options: [
                    {
                        name: 'New Calendar Coupons',
                        value: 'calendar_coupons',
                        description: 'Trigger on new coupons for a calendar'
                    },
                    {
                        name: 'New Event Coupons',
                        value: 'event_coupons',
                        description:
                            'Trigger on new coupons for a specific event'
                    },
                    {
                        name: 'New Event Guests',
                        value: 'event_guests',
                        description:
                            'Trigger on new guests for a specific event'
                    },
                    {
                        name: 'New Events',
                        value: 'events',
                        description: 'Trigger on new events in a calendar'
                    },
                    {
                        name: 'New People',
                        value: 'people',
                        description: 'Trigger on new people in a calendar'
                    },
                    {
                        name: 'New Person Tags',
                        value: 'person_tags',
                        description: 'Trigger on new person tags in a calendar'
                    }
                ],
                required: true,
                default: ['events'],
                description: 'Select which types of Luma events to monitor'
            },
            {
                displayName: 'Calendar ID',
                name: 'calendarId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        events: [
                            'events',
                            'people',
                            'person_tags',
                            'calendar_coupons'
                        ]
                    }
                },
                description: 'The calendar ID to monitor'
            },
            {
                displayName: 'Event ID',
                name: 'eventId',
                type: 'string',
                default: '',
                required: true,
                displayOptions: {
                    show: {
                        events: ['event_guests', 'event_coupons']
                    }
                },
                description: 'The event ID to monitor for guests or coupons'
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
                description: 'How often to poll for new items'
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
                        description:
                            'Filter events by series ID (for events only)',
                        displayOptions: {
                            show: {
                                '/events': ['events']
                            }
                        }
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
                        description: 'Filter events by state (for events only)',
                        displayOptions: {
                            show: {
                                '/events': ['events']
                            }
                        }
                    },
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
                        description:
                            'Filter guests by approval status (for event guests only)',
                        displayOptions: {
                            show: {
                                '/events': ['event_guests']
                            }
                        }
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
        const events = this.getNodeParameter('events') as string[];
        const calendarId = this.getNodeParameter('calendarId', '') as string;
        const eventId = this.getNodeParameter('eventId', '') as string;
        const additionalFields = this.getNodeParameter(
            'additionalFields',
            {}
        ) as IDataObject;

        // Get static data for maintaining state across different event types
        const staticData = this.getWorkflowStaticData('global');

        // Check if this is a manual trigger by checking if we have manual trigger context
        const isManualTrigger = this.getMode() === 'manual';

        if (isManualTrigger) {
            // For manual triggers, get fresh data without deduplication
            const allNewItems: any[] = [];

            for (const eventType of events) {
                try {
                    const newItems = await pollEventTypeManual.call(
                        this,
                        eventType,
                        calendarId,
                        eventId,
                        additionalFields
                    );
                    allNewItems.push(...newItems);
                } catch (error) {
                    // Handle rate limiting
                    if (error.response?.status === 429) {
                        this.logger?.warn(
                            `Luma Trigger rate limited for ${eventType} during manual test`
                        );
                        continue;
                    }

                    // Log other errors but don't stop
                    this.logger?.error(
                        `Luma Trigger error for ${eventType} during manual test:`,
                        error.message
                    );
                }
            }

            // Sort by creation time if available (newest first for manual testing)
            if (allNewItems.length > 0) {
                allNewItems.sort((a, b) => {
                    const timeA =
                        a.json.created_at ||
                        a.json.start_at ||
                        a.json.registered_at ||
                        a.json.joined_at ||
                        '';
                    const timeB =
                        b.json.created_at ||
                        b.json.start_at ||
                        b.json.registered_at ||
                        b.json.joined_at ||
                        '';
                    return timeB.localeCompare(timeA);
                });

                this.emit([allNewItems]);
            } else {
                // Emit empty result for manual testing to show the trigger structure
                this.emit([[]]);
            }
        } else {
            // Regular polling mode - handle deduplication and state management
            const allNewItems: any[] = [];

            for (const eventType of events) {
                try {
                    const newItems = await pollEventType.call(
                        this,
                        eventType,
                        calendarId,
                        eventId,
                        additionalFields,
                        staticData
                    );
                    allNewItems.push(...newItems);
                } catch (error) {
                    // Handle rate limiting with exponential backoff
                    if (error.response?.status === 429) {
                        // Rate limited - skip this poll cycle for this event type
                        this.logger?.warn(
                            `Luma Trigger rate limited for ${eventType}, skipping this cycle`
                        );
                        continue;
                    }

                    // Log other errors but don't stop polling
                    this.logger?.error(
                        `Luma Trigger error for ${eventType}:`,
                        error.message
                    );
                }
            }

            // Emit all new items if any were found
            if (allNewItems.length > 0) {
                // Sort by creation time if available
                allNewItems.sort((a, b) => {
                    const timeA =
                        a.json.created_at ||
                        a.json.start_at ||
                        a.json.registered_at ||
                        a.json.joined_at ||
                        '';
                    const timeB =
                        b.json.created_at ||
                        b.json.start_at ||
                        b.json.registered_at ||
                        b.json.joined_at ||
                        '';
                    return timeA.localeCompare(timeB);
                });

                this.emit([allNewItems]);
            }
        }

        return {
            closeFunction: async () => {
                // Cleanup if needed
            },
            manualTriggerFunction: async () => {
                // For manual triggers, get fresh data without deduplication
                const allNewItems: any[] = [];

                for (const eventType of events) {
                    try {
                        const newItems = await pollEventTypeManual.call(
                            this,
                            eventType,
                            calendarId,
                            eventId,
                            additionalFields
                        );
                        allNewItems.push(...newItems);
                    } catch (error) {
                        // Handle rate limiting
                        if (error.response?.status === 429) {
                            this.logger?.warn(
                                `Luma Trigger rate limited for ${eventType} during manual test`
                            );
                            continue;
                        }

                        // Log other errors but don't stop
                        this.logger?.error(
                            `Luma Trigger error for ${eventType} during manual test:`,
                            error.message
                        );
                    }
                }

                // Sort by creation time if available
                if (allNewItems.length > 0) {
                    allNewItems.sort((a, b) => {
                        const timeA =
                            a.json.created_at ||
                            a.json.start_at ||
                            a.json.registered_at ||
                            a.json.joined_at ||
                            '';
                        const timeB =
                            b.json.created_at ||
                            b.json.start_at ||
                            b.json.registered_at ||
                            b.json.joined_at ||
                            '';
                        return timeB.localeCompare(timeA); // Newest first for manual testing
                    });

                    this.emit([allNewItems]);
                } else {
                    // Emit empty result for manual testing to show the trigger structure
                    this.emit([[]]);
                }
            }
        };
    }
}

async function pollEventTypeManual(
    this: ITriggerFunctions,
    eventType: string,
    calendarId: string,
    eventId: string,
    additionalFields: IDataObject
): Promise<any[]> {
    const credentials = await this.getCredentials('lumaApi');
    const currentTime = new Date().toISOString();

    // For manual triggers, don't use lastPollTime to get fresh recent data
    const apiConfig = getApiConfig(
        eventType,
        calendarId,
        eventId,
        additionalFields
    );

    // Limit results for manual testing to avoid overwhelming output
    const manualLimit = Math.min((additionalFields.limit as number) || 10, 10);
    apiConfig.params.limit = manualLimit;

    const requestOptions = {
        method: 'GET' as IHttpRequestMethods,
        url: apiConfig.url,
        qs: apiConfig.params,
        headers: {
            'x-luma-api-key': credentials.apiKey,
            'Content-Type': 'application/json'
        },
        json: true
    };

    const response = await this.helpers.request(requestOptions);
    const items = response.entries || [];
    const newItems: any[] = [];

    // For manual triggers, return items without deduplication
    for (const item of items) {
        newItems.push({
            json: {
                ...item,
                _eventType: eventType,
                _triggeredAt: currentTime,
                _manualTrigger: true // Flag to indicate this was from manual testing
            }
        });
    }

    return newItems;
}

async function pollEventType(
    this: ITriggerFunctions,
    eventType: string,
    calendarId: string,
    eventId: string,
    additionalFields: IDataObject,
    staticData: IDataObject
): Promise<any[]> {
    const credentials = await this.getCredentials('lumaApi');
    const currentTime = new Date().toISOString();

    // Get state specific to this event type
    const stateKey = `${eventType}_lastPollTime`;
    const seenKey = `${eventType}_seenIds`;
    const lastPollTime = staticData[stateKey] as string;
    const seenIds = (staticData[seenKey] as string[]) || [];

    const apiConfig = getApiConfig(
        eventType,
        calendarId,
        eventId,
        additionalFields,
        lastPollTime
    );

    const requestOptions = {
        method: 'GET' as IHttpRequestMethods,
        url: apiConfig.url,
        qs: apiConfig.params,
        headers: {
            'x-luma-api-key': credentials.apiKey,
            'Content-Type': 'application/json'
        },
        json: true
    };

    const response = await this.helpers.request(requestOptions);
    const items = response.entries || [];
    const newItems: any[] = [];

    for (const item of items) {
        const itemId = getItemId(item, eventType);

        // Skip if we've already seen this item
        if (!seenIds.includes(itemId)) {
            newItems.push({
                json: {
                    ...item,
                    _eventType: eventType, // Add metadata about which trigger type this came from
                    _triggeredAt: currentTime
                }
            });
            seenIds.push(itemId);
        }
    }

    // Limit seen IDs to prevent memory bloat (keep last 1000 per event type)
    if (seenIds.length > 1000) {
        staticData[seenKey] = seenIds.slice(-1000);
    } else {
        staticData[seenKey] = seenIds;
    }

    // Update last poll time for this event type
    staticData[stateKey] = currentTime;

    return newItems;
}

function getApiConfig(
    eventType: string,
    calendarId: string,
    eventId: string,
    additionalFields: IDataObject,
    lastPollTime?: string | undefined
): { url: string; params: IDataObject } {
    const params: IDataObject = {};

    if (additionalFields.limit) {
        params.limit = additionalFields.limit;
    }

    // Add cursor for pagination if we have a last poll time
    if (lastPollTime) {
        params.after = lastPollTime;
    }

    switch (eventType) {
        case 'events':
            params.calendar_id = calendarId;
            if (additionalFields.seriesId) {
                params.series_id = additionalFields.seriesId;
            }
            if (additionalFields.eventState) {
                params.event_state = additionalFields.eventState;
            }
            return {
                url: buildLumaApiUrl(LUMA_ENDPOINTS.CALENDAR_LIST_EVENTS),
                params
            };

        case 'event_guests':
            params.event_id = eventId;
            if (additionalFields.approvalStatus) {
                params.approval_status = additionalFields.approvalStatus;
            }
            return {
                url: buildLumaApiUrl(LUMA_ENDPOINTS.EVENT_GET_GUESTS),
                params
            };

        case 'people':
            params.calendar_id = calendarId;
            return {
                url: buildLumaApiUrl(LUMA_ENDPOINTS.CALENDAR_LIST_PEOPLE),
                params
            };

        case 'person_tags':
            params.calendar_id = calendarId;
            return {
                url: buildLumaApiUrl(LUMA_ENDPOINTS.CALENDAR_LIST_PERSON_TAGS),
                params
            };

        case 'event_coupons':
            params.event_id = eventId;
            return {
                url: buildLumaApiUrl(LUMA_ENDPOINTS.EVENT_LIST_COUPONS),
                params
            };

        case 'calendar_coupons':
            params.calendar_id = calendarId;
            return {
                url: buildLumaApiUrl(LUMA_ENDPOINTS.CALENDAR_LIST_COUPONS),
                params
            };

        default:
            throw new NodeOperationError(
                { type: 'unknown-event-type' } as any,
                `Unknown event type: ${eventType}`
            );
    }
}

function getItemId(item: any, eventType: string): string {
    switch (eventType) {
        case 'events':
            return item.event_id || item.id;
        case 'event_guests':
            return item.guest_id || item.id;
        case 'people':
            return item.person_id || item.id;
        case 'person_tags':
            return item.tag_id || item.id;
        case 'event_coupons':
        case 'calendar_coupons':
            return item.coupon_id || item.id;
        default:
            return (
                item.id ||
                item.event_id ||
                item.guest_id ||
                item.person_id ||
                item.tag_id ||
                item.coupon_id
            );
    }
}
