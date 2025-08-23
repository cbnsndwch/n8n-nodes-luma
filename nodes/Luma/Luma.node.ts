import type {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IDataObject,
    IHttpRequestMethods
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

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
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Event',
                        value: 'event'
                    }
                ],
                default: 'event'
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['event']
                    }
                },
                options: [
                    {
                        name: 'Create',
                        value: 'create',
                        action: 'Create an event'
                    },
                    {
                        name: 'Delete',
                        value: 'delete',
                        action: 'Delete an event'
                    },
                    {
                        name: 'Get',
                        value: 'get',
                        action: 'Get an event'
                    },
                    {
                        name: 'Get Many',
                        value: 'getMany',
                        action: 'Get many events'
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        action: 'Update an event'
                    }
                ],
                default: 'get'
            },
            // Event ID parameter (for get, update, delete operations)
            {
                displayName: 'Event ID',
                name: 'eventId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['event'],
                        operation: ['get', 'update', 'delete']
                    }
                },
                default: '',
                description: 'The ID of the event'
            },
            // Calendar ID parameter (for getMany and create operations)
            {
                displayName: 'Calendar ID',
                name: 'calendarId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['event'],
                        operation: ['getMany', 'create']
                    }
                },
                default: '',
                description: 'The ID of the calendar'
            },
            // Event Name parameter (for create and update operations)
            {
                displayName: 'Event Name',
                name: 'eventName',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['event'],
                        operation: ['create']
                    }
                },
                default: '',
                description: 'The name of the event'
            },
            // Event Description parameter (for create and update operations)
            {
                displayName: 'Event Description',
                name: 'eventDescription',
                type: 'string',
                displayOptions: {
                    show: {
                        resource: ['event'],
                        operation: ['create', 'update']
                    }
                },
                default: '',
                description: 'The description of the event'
            },
            // Start Date parameter (for create operation)
            {
                displayName: 'Start Date',
                name: 'startAt',
                type: 'dateTime',
                required: true,
                displayOptions: {
                    show: {
                        resource: ['event'],
                        operation: ['create']
                    }
                },
                default: '',
                description: 'The start date and time of the event'
            },
            // Additional Fields collection
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['event'],
                        operation: ['create', 'update', 'getMany']
                    }
                },
                options: [
                    {
                        displayName: 'Approval Required',
                        name: 'approvalRequired',
                        type: 'boolean',
                        default: false,
                        description:
                            'Whether approval is required for registrations'
                    },
                    {
                        displayName: 'Capacity',
                        name: 'capacity',
                        type: 'number',
                        default: '',
                        description: 'Maximum number of attendees'
                    },
                    {
                        displayName: 'End Date',
                        name: 'endAt',
                        type: 'dateTime',
                        default: '',
                        description: 'The end date and time of the event'
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
                        description:
                            'Filter events by state (for getMany operation)'
                    },
                    {
                        displayName: 'Limit',
                        name: 'limit',
                        type: 'number',
                        typeOptions: {
                            minValue: 1
                        },
                        default: 50,
                        description: 'Max number of results to return'
                    },
                    {
                        displayName: 'Location Address',
                        name: 'locationAddress',
                        type: 'string',
                        default: '',
                        description: 'The address of the location'
                    },
                    {
                        displayName: 'Location Name',
                        name: 'locationName',
                        type: 'string',
                        default: '',
                        description: 'The name of the location'
                    },
                    {
                        displayName: 'Location Type',
                        name: 'locationType',
                        type: 'options',
                        options: [
                            {
                                name: 'Venue',
                                value: 'venue'
                            },
                            {
                                name: 'Online',
                                value: 'online'
                            },
                            {
                                name: 'TBD',
                                value: 'tbd'
                            }
                        ],
                        default: 'tbd',
                        description: 'The type of location for the event'
                    },
                    {
                        displayName: 'Location URL',
                        name: 'locationUrl',
                        type: 'string',
                        default: '',
                        description: 'The URL for online events or venue links'
                    },
                    {
                        displayName: 'Series ID',
                        name: 'seriesId',
                        type: 'string',
                        default: '',
                        description:
                            'Filter events by series ID (for getMany operation)'
                    },
                    {
                        displayName: 'Timezone',
                        name: 'timezone',
                        type: 'string',
                        default: 'UTC',
                        description:
                            'The timezone for the event (e.g., America/New_York)'
                    },
                    {
                        displayName: 'Visibility',
                        name: 'visibility',
                        type: 'options',
                        options: [
                            {
                                name: 'Public',
                                value: 'public'
                            },
                            {
                                name: 'Private',
                                value: 'private'
                            }
                        ],
                        default: 'public',
                        description: 'The visibility of the event'
                    }
                ]
            }
        ]
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            try {
                const resource = this.getNodeParameter('resource', i) as string;
                const operation = this.getNodeParameter(
                    'operation',
                    i
                ) as string;

                if (resource === 'event') {
                    if (operation === 'get') {
                        // Get single event
                        const eventId = this.getNodeParameter(
                            'eventId',
                            i
                        ) as string;

                        const responseData =
                            await this.helpers.requestWithAuthentication.call(
                                this,
                                'lumaApi',
                                {
                                    method: 'GET' as IHttpRequestMethods,
                                    url: `https://api.lu.ma/public/v1/event/get`,
                                    qs: {
                                        event_id: eventId
                                    },
                                    json: true
                                }
                            );

                        returnData.push({
                            json: responseData,
                            pairedItem: { item: i }
                        });
                    } else if (operation === 'getMany') {
                        // Get many events
                        const calendarId = this.getNodeParameter(
                            'calendarId',
                            i
                        ) as string;
                        const additionalFields = this.getNodeParameter(
                            'additionalFields',
                            i
                        ) as IDataObject;

                        const qs: IDataObject = {
                            calendar_id: calendarId
                        };

                        if (additionalFields.limit) {
                            qs.limit = additionalFields.limit;
                        }
                        if (additionalFields.seriesId) {
                            qs.series_id = additionalFields.seriesId;
                        }
                        if (additionalFields.eventState) {
                            qs.event_state = additionalFields.eventState;
                        }

                        const responseData =
                            await this.helpers.requestWithAuthentication.call(
                                this,
                                'lumaApi',
                                {
                                    method: 'GET' as IHttpRequestMethods,
                                    url: `https://api.lu.ma/public/v1/calendar/list-events`,
                                    qs,
                                    json: true
                                }
                            );

                        // Return the events array if it exists, otherwise return the full response
                        const events = responseData.entries || responseData;
                        if (Array.isArray(events)) {
                            events.forEach(event => {
                                returnData.push({
                                    json: event,
                                    pairedItem: { item: i }
                                });
                            });
                        } else {
                            returnData.push({
                                json: responseData,
                                pairedItem: { item: i }
                            });
                        }
                    } else if (operation === 'create') {
                        // Create new event
                        const calendarId = this.getNodeParameter(
                            'calendarId',
                            i
                        ) as string;
                        const eventName = this.getNodeParameter(
                            'eventName',
                            i
                        ) as string;
                        const eventDescription = this.getNodeParameter(
                            'eventDescription',
                            i
                        ) as string;
                        const startAt = this.getNodeParameter(
                            'startAt',
                            i
                        ) as string;
                        const additionalFields = this.getNodeParameter(
                            'additionalFields',
                            i
                        ) as IDataObject;

                        const body: IDataObject = {
                            calendar_id: calendarId,
                            name: eventName,
                            start_at: startAt
                        };

                        if (eventDescription) {
                            body.description = eventDescription;
                        }
                        if (additionalFields.endAt) {
                            body.end_at = additionalFields.endAt;
                        }
                        if (additionalFields.timezone) {
                            body.timezone = additionalFields.timezone;
                        }
                        if (additionalFields.visibility) {
                            body.visibility = additionalFields.visibility;
                        }
                        if (additionalFields.approvalRequired !== undefined) {
                            body.approval_required =
                                additionalFields.approvalRequired;
                        }
                        if (additionalFields.capacity) {
                            body.capacity = additionalFields.capacity;
                        }

                        // Handle location if specified
                        if (additionalFields.locationType) {
                            const location: IDataObject = {
                                type: additionalFields.locationType
                            };
                            if (additionalFields.locationName) {
                                location.name = additionalFields.locationName;
                            }
                            if (additionalFields.locationAddress) {
                                location.address =
                                    additionalFields.locationAddress;
                            }
                            if (additionalFields.locationUrl) {
                                location.url = additionalFields.locationUrl;
                            }
                            body.location = location;
                        }

                        const responseData =
                            await this.helpers.requestWithAuthentication.call(
                                this,
                                'lumaApi',
                                {
                                    method: 'POST' as IHttpRequestMethods,
                                    url: `https://api.lu.ma/public/v1/event/create`,
                                    body,
                                    json: true
                                }
                            );

                        returnData.push({
                            json: responseData,
                            pairedItem: { item: i }
                        });
                    } else if (operation === 'update') {
                        // Update existing event
                        const eventId = this.getNodeParameter(
                            'eventId',
                            i
                        ) as string;
                        const eventDescription = this.getNodeParameter(
                            'eventDescription',
                            i
                        ) as string;
                        const additionalFields = this.getNodeParameter(
                            'additionalFields',
                            i
                        ) as IDataObject;

                        const body: IDataObject = {
                            event_id: eventId
                        };

                        if (eventDescription) {
                            body.description = eventDescription;
                        }
                        if (additionalFields.endAt) {
                            body.end_at = additionalFields.endAt;
                        }
                        if (additionalFields.timezone) {
                            body.timezone = additionalFields.timezone;
                        }
                        if (additionalFields.visibility) {
                            body.visibility = additionalFields.visibility;
                        }
                        if (additionalFields.approvalRequired !== undefined) {
                            body.approval_required =
                                additionalFields.approvalRequired;
                        }
                        if (additionalFields.capacity) {
                            body.capacity = additionalFields.capacity;
                        }

                        // Handle location if specified
                        if (additionalFields.locationType) {
                            const location: IDataObject = {
                                type: additionalFields.locationType
                            };
                            if (additionalFields.locationName) {
                                location.name = additionalFields.locationName;
                            }
                            if (additionalFields.locationAddress) {
                                location.address =
                                    additionalFields.locationAddress;
                            }
                            if (additionalFields.locationUrl) {
                                location.url = additionalFields.locationUrl;
                            }
                            body.location = location;
                        }

                        const responseData =
                            await this.helpers.requestWithAuthentication.call(
                                this,
                                'lumaApi',
                                {
                                    method: 'POST' as IHttpRequestMethods,
                                    url: `https://api.lu.ma/public/v1/event/update`,
                                    body,
                                    json: true
                                }
                            );

                        returnData.push({
                            json: responseData,
                            pairedItem: { item: i }
                        });
                    } else if (operation === 'delete') {
                        // Delete event
                        const eventId = this.getNodeParameter(
                            'eventId',
                            i
                        ) as string;

                        const responseData =
                            await this.helpers.requestWithAuthentication.call(
                                this,
                                'lumaApi',
                                {
                                    method: 'POST' as IHttpRequestMethods,
                                    url: `https://api.lu.ma/public/v1/event/delete`,
                                    body: {
                                        event_id: eventId
                                    },
                                    json: true
                                }
                            );

                        returnData.push({
                            json: responseData,
                            pairedItem: { item: i }
                        });
                    } else {
                        throw new NodeOperationError(
                            this.getNode(),
                            `The operation "${operation}" is not supported!`
                        );
                    }
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
