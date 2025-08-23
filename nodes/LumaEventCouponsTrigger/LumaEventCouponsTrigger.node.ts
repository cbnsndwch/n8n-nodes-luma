import type {
    ITriggerFunctions,
    INodeType,
    INodeTypeDescription,
    ITriggerResponse,
    IDataObject,
    IHttpRequestMethods
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class LumaEventCouponsTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Luma Event Coupons Trigger',
        name: 'lumaEventCouponsTrigger',
        icon: 'file:luma.svg',
        group: ['trigger'],
        version: 1,
        subtitle: 'Poll for new event coupons',
        description: 'Triggers on new Luma event coupons',
        defaults: {
            name: 'Luma Event Coupons Trigger'
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
                description: 'The event ID to monitor for new coupons'
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
        const seenCouponIds = (staticData.seenCouponIds as string[]) || [];

        const pollFunction = async () => {
            try {
                const credentials = await this.getCredentials('lumaApi');
                const currentTime = new Date().toISOString();

                // Build API request parameters
                const params: IDataObject = {
                    event_id: eventId
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
                    url: 'https://api.lu.ma/public/v1/event/list-coupons',
                    qs: params,
                    headers: {
                        'x-luma-api-key': credentials.apiKey,
                        'Content-Type': 'application/json'
                    },
                    json: true
                };

                const response = await this.helpers.request(requestOptions);

                // Process new coupons
                const newCoupons = [];
                const coupons = response.entries || [];

                for (const coupon of coupons) {
                    const couponId = coupon.coupon_id || coupon.id;

                    // Skip if we've already seen this coupon
                    if (!seenCouponIds.includes(couponId)) {
                        newCoupons.push({
                            json: coupon
                        });
                        seenCouponIds.push(couponId);
                    }
                }

                // Limit seen coupon IDs to prevent memory bloat (keep last 1000)
                if (seenCouponIds.length > 1000) {
                    staticData.seenCouponIds = seenCouponIds.slice(-1000);
                } else {
                    staticData.seenCouponIds = seenCouponIds;
                }

                // Update last poll time
                staticData.lastPollTime = currentTime;

                // Emit new coupons in chronological order
                if (newCoupons.length > 0) {
                    // Sort by creation time if available
                    newCoupons.sort((a, b) => {
                        const timeA = a.json.created_at || '';
                        const timeB = b.json.created_at || '';
                        return timeA.localeCompare(timeB);
                    });

                    this.emit([newCoupons]);
                }
            } catch (error) {
                // Handle rate limiting with exponential backoff
                if (error.response?.status === 429) {
                    // Rate limited - skip this poll cycle
                    return;
                }

                // Log other errors but don't stop polling
                this.logger?.error(
                    'Luma Event Coupons Trigger error:',
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
