import {
    INodeProperties,
    INodePropertyCollection,
    INodePropertyOptions
} from 'n8n-workflow';
import { describe, it, expect } from 'vitest';

describe('Frontend User Experience', () => {
    describe('Node Property Validation', () => {
        it('should validate that nodes have user-friendly properties', async () => {
            // Test that built nodes have the expected structure for good UX
            const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
            const { LumaTrigger } = await import(
                '../../dist/nodes/LumaTrigger/LumaTrigger.node.js'
            );

            const lumaNode = new Luma();
            const triggerNode = new LumaTrigger();

            // Nodes should have clear display names
            expect(lumaNode.description.displayName).toBe('Luma');
            expect(triggerNode.description.displayName).toBe('Luma Trigger');

            // Should have descriptions for users
            expect(lumaNode.description.description).toContain('Luma API');
            expect(triggerNode.description.description).toContain('Luma');
        });

        it('should have proper node grouping for n8n UI', async () => {
            const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
            const { LumaTrigger } = await import(
                '../../dist/nodes/LumaTrigger/LumaTrigger.node.js'
            );

            const lumaNode = new Luma();
            const triggerNode = new LumaTrigger();

            // Nodes should be in appropriate groups
            expect(lumaNode.description.group).toContain('output');
            expect(triggerNode.description.group).toContain('trigger');
        });

        it('should have consistent iconography', async () => {
            const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
            const { LumaTrigger } = await import(
                '../../dist/nodes/LumaTrigger/LumaTrigger.node.js'
            );

            const lumaNode = new Luma();
            const triggerNode = new LumaTrigger();

            // Both nodes should use the same icon for brand consistency
            expect(lumaNode.description.icon).toBe('file:luma.svg');
            expect(triggerNode.description.icon).toBe('file:luma.svg');
        });
    });

    describe('Parameter Structure', () => {
        it('should have logical parameter hierarchy', async () => {
            const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
            const lumaNode = new Luma();

            const properties = lumaNode.description.properties;
            expect(properties.length).toBeGreaterThan(0);

            // First property should be the resource selector
            expect(properties[0].name).toBe('resource');
            expect(properties[0].type).toBe('options');
        });

        it('should have resource options available', async () => {
            const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
            const lumaNode = new Luma();

            const resourceProperty = lumaNode.description.properties.find(
                (p: any) => p.name === 'resource'
            );
            expect(resourceProperty).toBeDefined();
            expect(resourceProperty?.options).toBeDefined();
            expect(Array.isArray(resourceProperty?.options)).toBe(true);
            expect((resourceProperty?.options as any[]).length).toBeGreaterThan(
                0
            );
        });

        it('should have conditional parameter display', async () => {
            const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
            const lumaNode = new Luma();

            const properties = lumaNode.description.properties;

            // Should have properties that show/hide based on selections
            const conditionalProperties = properties.filter(
                (p: any) => p.displayOptions?.show
            );
            expect(conditionalProperties.length).toBeGreaterThan(0);
        });
    });

    describe('Trigger Node UX', () => {
        it('should have event monitoring options', async () => {
            const { LumaTrigger } = await import(
                '../../dist/nodes/LumaTrigger/LumaTrigger.node.js'
            );
            const triggerNode = new LumaTrigger();

            const eventsProperty = triggerNode.description.properties.find(
                (p: any) => p.name === 'events'
            );
            expect(eventsProperty).toBeDefined();
            expect(eventsProperty?.type).toBe('multiOptions');
            expect(eventsProperty?.displayName).toBe('Events to Monitor');
        });

        it('should have proper polling configuration', async () => {
            const { LumaTrigger } = await import(
                '../../dist/nodes/LumaTrigger/LumaTrigger.node.js'
            );
            const triggerNode = new LumaTrigger();

            expect(triggerNode.description.polling).toBe(true);
            expect(triggerNode.description.inputs).toEqual([]);
            expect(triggerNode.description.outputs).toEqual(['main']);
        });
    });

    describe('Credential Integration UX', () => {
        it('should require credentials with clear naming', async () => {
            const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
            const { LumaTrigger } = await import(
                '../../dist/nodes/LumaTrigger/LumaTrigger.node.js'
            );

            const lumaNode = new Luma();
            const triggerNode = new LumaTrigger();

            expect(lumaNode.description.credentials).toEqual([
                { name: 'lumaApi', required: true }
            ]);
            expect(triggerNode.description.credentials).toEqual([
                { name: 'lumaApi', required: true }
            ]);
        });

        it('should have credential with user-friendly configuration', async () => {
            const { LumaApi } = await import(
                '../../dist/credentials/LumaApi.credentials.js'
            );
            const credential = new LumaApi();

            expect(credential.displayName).toBe('Luma API');
            expect(credential.documentationUrl).toContain('docs.lu.ma');

            // Should have password field for API key
            const apiKeyProperty = credential.properties.find(
                (p: any) => p.name === 'apiKey'
            );
            expect(apiKeyProperty?.typeOptions?.password).toBe(true);
        });
    });

    describe('Workflow Building Experience', () => {
        it('should provide helpful subtitle templates', async () => {
            const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
            const { LumaTrigger } = await import(
                '../../dist/nodes/LumaTrigger/LumaTrigger.node.js'
            );

            const lumaNode = new Luma();
            const triggerNode = new LumaTrigger();

            // Subtitles should show current configuration
            expect(lumaNode.description.subtitle).toContain('$parameter');
            expect(triggerNode.description.subtitle).toContain(
                '$parameter["events"]'
            );
        });

        it('should have meaningful default values', async () => {
            const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
            const lumaNode = new Luma();

            const resourceProperty = lumaNode.description.properties.find(
                (p: any) => p.name === 'resource'
            );
            expect(resourceProperty?.default).toBeDefined();
        });

        it('should prevent data expression errors where appropriate', async () => {
            const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
            const lumaNode = new Luma();

            const resourceProperty = lumaNode.description.properties.find(
                (p: any) => p.name === 'resource'
            );
            expect(resourceProperty?.noDataExpression).toBe(true);
        });
    });

    describe('Ticket Create Parameter Structure', () => {
        it('should have ticket create operation available', async () => {
            const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
            const lumaNode = new Luma();

            const properties = lumaNode.description.properties;

            // Find operation property for ticket resource
            const operationProps = properties.filter(
                (p: any) =>
                    p.name === 'operation' &&
                    p.displayOptions?.show?.resource?.includes('ticket')
            );

            expect(operationProps.length).toBeGreaterThan(0);

            const ticketOperations = operationProps[0];
            const createOption = ticketOperations.options?.find(
                (opt: any) => opt.value === 'create'
            );
            expect(createOption).toBeDefined();
            expect(createOption?.name).toBe('Create New Ticket Type');
        });

        it('should have required fields for ticket create', async () => {
            const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
            const lumaNode = new Luma();

            const properties = lumaNode.description.properties;

            // Check for eventId field
            const eventIdField = properties.find(
                (p: any) =>
                    p.name === 'eventId' &&
                    p.displayOptions?.show?.operation?.includes('create')
            );
            expect(eventIdField).toBeDefined();
            expect(eventIdField?.required).toBe(true);

            // Check for name field
            const nameField = properties.find(
                (p: any) =>
                    p.name === 'name' &&
                    p.displayOptions?.show?.operation?.includes('create')
            );
            expect(nameField).toBeDefined();
            expect(nameField?.required).toBe(true);

            // Check for price field
            const priceField = properties.find(
                (p: any) =>
                    p.name === 'price' &&
                    p.displayOptions?.show?.operation?.includes('create')
            );
            expect(priceField).toBeDefined();
            expect(priceField?.required).toBe(true);
            expect(priceField?.type).toBe('number');
        });

        it('should have additional fields for ticket create', async () => {
            const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
            const lumaNode = new Luma();

            const properties = lumaNode.description.properties;

            // Check for additionalFields specifically for ticket create operation
            const additionalFieldsProps = properties.filter(
                (p: any) =>
                    p.name === 'additionalFields' &&
                    p.displayOptions?.show?.resource?.includes('ticket') &&
                    p.displayOptions?.show?.operation?.includes('create')
            );

            expect(additionalFieldsProps.length).toBeGreaterThan(0);
            const additionalFields = additionalFieldsProps.find(
                (p: any) =>
                    p.options &&
                    p.options.some((opt: any) => opt.name === 'description')
            );

            expect(additionalFields).toBeDefined();
            expect(additionalFields?.type).toBe('collection');

            // Check for specific optional fields
            const options = additionalFields?.options || [];
            const fieldNames = options.map((opt: any) => opt.name);

            expect(fieldNames).toContain('description');
            expect(fieldNames).toContain('capacity');
            expect(fieldNames).toContain('minQuantity');
            expect(fieldNames).toContain('maxQuantity');
            expect(fieldNames).toContain('isHidden');
            expect(fieldNames).toContain('requiresApproval');
        });

        it('should have pricing tiers configuration', async () => {
            const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
            const lumaNode = new Luma();

            const properties = lumaNode.description.properties;

            const additionalFieldsProps = properties.filter(
                (p: any) =>
                    p.name === 'additionalFields' &&
                    p.displayOptions?.show?.resource?.includes('ticket') &&
                    p.displayOptions?.show?.operation?.includes('create')
            );

            const additionalFields = additionalFieldsProps.find(
                (p: any) =>
                    p.options &&
                    p.options.some((opt: any) => opt.name === 'pricingTiers')
            );

            const pricingTiers = additionalFields?.options?.find(
                (opt: any) => opt.name === 'pricingTiers'
            );
            expect(pricingTiers).toBeDefined();
            expect((pricingTiers as INodeProperties)?.type).toBe(
                'fixedCollection'
            );
            expect(
                (pricingTiers as INodeProperties)?.typeOptions?.multipleValues
            ).toBe(true);

            // Check pricing tier fields
            const tierFields =
                (
                    (pricingTiers as INodeProperties)
                        ?.options?.[0] as INodePropertyCollection
                )?.values || [];
            const tierFieldNames = tierFields.map((field: any) => field.name);

            expect(tierFieldNames).toContain('name');
            expect(tierFieldNames).toContain('price');
            expect(tierFieldNames).toContain('startAt');
            expect(tierFieldNames).toContain('endAt');
            expect(tierFieldNames).toContain('capacity');
        });

        it('should have discount rules configuration', async () => {
            const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
            const lumaNode = new Luma();

            const properties = lumaNode.description.properties;

            const additionalFieldsProps = properties.filter(
                (p: any) =>
                    p.name === 'additionalFields' &&
                    p.displayOptions?.show?.resource?.includes('ticket') &&
                    p.displayOptions?.show?.operation?.includes('create')
            );

            const additionalFields = additionalFieldsProps.find(
                (p: any) =>
                    p.options &&
                    p.options.some((opt: any) => opt.name === 'discountRules')
            );

            const discountRules = additionalFields?.options?.find(
                (opt: any) => opt.name === 'discountRules'
            );
            expect(discountRules).toBeDefined();
            expect(discountRules?.type).toBe('fixedCollection');
            expect(discountRules?.typeOptions?.multipleValues).toBe(true);

            // Check discount rule fields
            const ruleFields = discountRules?.options?.[0]?.values || [];
            const ruleFieldNames = ruleFields.map((field: any) => field.name);

            expect(ruleFieldNames).toContain('type');
            expect(ruleFieldNames).toContain('value');
            expect(ruleFieldNames).toContain('minQuantity');
            expect(ruleFieldNames).toContain('validUntil');

            // Check discount types
            const typeField = ruleFields.find(
                (field: any) => field.name === 'type'
            );
            const typeOptions =
                typeField?.options?.map((opt: any) => opt.value) || [];
            expect(typeOptions).toContain('early_bird');
            expect(typeOptions).toContain('bulk');
            expect(typeOptions).toContain('promo_code');
        });
    });

    describe('Guest Reject Operation UX', () => {
        it('should have user-friendly reject operation option', async () => {
            const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
            const lumaNode = new Luma();

            const properties = lumaNode.description.properties;
            const guestOperationProperty = properties.find(
                (p: any) =>
                    p.name === 'operation' &&
                    p.displayOptions?.show?.resource?.includes('guest')
            );

            expect(guestOperationProperty).toBeDefined();

            const rejectOption = guestOperationProperty?.options?.find(
                (option: any) => option.value === 'reject'
            );

            expect(rejectOption).toBeDefined();
            expect(rejectOption?.name).toBe('Reject');
            expect(rejectOption?.description).toBe(
                'Reject pending guest registrations'
            );
            expect(rejectOption?.action).toBe('Reject guest registration');
        });

        it('should have intuitive rejection reason field', async () => {
            const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
            const lumaNode = new Luma();

            const properties = lumaNode.description.properties;
            const rejectionReasonProperty = properties.find(
                (p: any) => p.name === 'rejectionReason'
            );

            expect(rejectionReasonProperty).toBeDefined();
            expect(rejectionReasonProperty?.displayName).toBe(
                'Rejection Reason'
            );
            expect(rejectionReasonProperty?.required).toBe(true);
            expect(rejectionReasonProperty?.type).toBe('string');
            expect(rejectionReasonProperty?.typeOptions?.rows).toBe(3);
            expect(rejectionReasonProperty?.placeholder).toContain(
                'Reason for rejecting'
            );
        });

        it('should have logical field progression for reject operation', async () => {
            const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
            const lumaNode = new Luma();

            const properties = lumaNode.description.properties;

            // Find reject-specific fields
            const guestIdField = properties.find(
                (p: any) =>
                    p.name === 'guestId' &&
                    p.displayOptions?.show?.operation?.includes('reject')
            );
            const rejectionReasonField = properties.find(
                (p: any) => p.name === 'rejectionReason'
            );
            const additionalFields = properties.find(
                (p: any) =>
                    p.name === 'additionalFields' &&
                    p.displayOptions?.show?.operation?.includes('reject')
            );

            expect(guestIdField).toBeDefined();
            expect(rejectionReasonField).toBeDefined();
            expect(additionalFields).toBeDefined();

            // Guest ID and rejection reason should be required
            expect(guestIdField?.required).toBe(true);
            expect(rejectionReasonField?.required).toBe(true);
            expect(additionalFields?.required).toBeFalsy();
        });

        it('should have helpful additional fields for reject operation', async () => {
            const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
            const lumaNode = new Luma();

            const properties = lumaNode.description.properties;
            const rejectAdditionalFields = properties.find(
                (p: any) =>
                    p.name === 'additionalFields' &&
                    p.displayOptions?.show?.operation?.includes('reject')
            );

            expect(rejectAdditionalFields).toBeDefined();
            expect(rejectAdditionalFields?.type).toBe('collection');
            expect(rejectAdditionalFields?.displayName).toBe(
                'Additional Fields'
            );

            const options = rejectAdditionalFields?.options || [];

            // Check send notification option
            const sendNotificationOption = options.find(
                (opt: any) => opt.name === 'sendNotification'
            );
            expect(sendNotificationOption?.displayName).toBe(
                'Send Notification'
            );
            expect(sendNotificationOption?.type).toBe('boolean');
            expect(sendNotificationOption?.default).toBe(true);

            // Check custom message option
            const customMessageOption = options.find(
                (opt: any) => opt.name === 'customMessage'
            );
            expect(customMessageOption?.displayName).toBe('Custom Message');
            expect(customMessageOption?.type).toBe('string');
            expect(customMessageOption?.typeOptions?.rows).toBe(3);

            // Check allow reapply option
            const allowReapplyOption = options.find(
                (opt: any) => opt.name === 'allowReapply'
            );
            expect(allowReapplyOption?.displayName).toBe('Allow Reapply');
            expect(allowReapplyOption?.type).toBe('boolean');
            expect(allowReapplyOption?.default).toBe(false);
        });

        it('should support bulk operations with clear messaging', async () => {
            const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
            const lumaNode = new Luma();

            const properties = lumaNode.description.properties;
            const guestIdField = properties.find(
                (p: any) =>
                    p.name === 'guestId' &&
                    p.displayOptions?.show?.operation?.includes('reject')
            );

            expect(guestIdField?.placeholder).toContain('multiple');
            expect(guestIdField?.description).toContain('bulk');
            expect(guestIdField?.description).toContain('comma-separated');
        });
    });

    describe('Guest Cancel Operation UX', () => {
        it('should have clear cancel operation option', async () => {
            const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
            const lumaNode = new Luma();

            const properties = lumaNode.description.properties;
            const operationField = properties.find(
                (p: any) =>
                    p.name === 'operation' &&
                    p.displayOptions?.show?.resource?.includes('guest')
            );

            expect(operationField).toBeDefined();

            const cancelOperation = operationField?.options?.find(
                (opt: any) => opt.value === 'cancel'
            );
            expect(cancelOperation).toBeDefined();
            expect(cancelOperation?.name).toBe('Cancel');
            expect(cancelOperation?.description).toBe(
                'Cancel guest registrations'
            );
            expect(cancelOperation?.action).toBe('Cancel guest registration');
        });

        it('should have user-friendly cancelledBy field', async () => {
            const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
            const lumaNode = new Luma();

            const properties = lumaNode.description.properties;
            const cancelledByField = properties.find(
                (p: any) => p.name === 'cancelledBy'
            );

            expect(cancelledByField).toBeDefined();
            expect(cancelledByField?.displayName).toBe('Cancelled By');
            expect(cancelledByField?.type).toBe('options');
            expect(cancelledByField?.required).toBe(true);
            expect(cancelledByField?.default).toBe('guest');

            const options = cancelledByField?.options || [];
            expect(options).toHaveLength(2);

            const guestOption = options.find(
                (opt: any) => opt.value === 'guest'
            );
            const organizerOption = options.find(
                (opt: any) => opt.value === 'organizer'
            );

            expect(guestOption?.name).toBe('Guest');
            expect(organizerOption?.name).toBe('Organizer');
        });

        it('should have proper field visibility for cancel operation', async () => {
            const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
            const lumaNode = new Luma();

            const properties = lumaNode.description.properties;

            // Find cancel-specific fields
            const guestIdField = properties.find(
                (p: any) =>
                    p.name === 'guestId' &&
                    p.displayOptions?.show?.operation?.includes('cancel')
            );
            const cancelledByField = properties.find(
                (p: any) => p.name === 'cancelledBy'
            );
            const additionalFields = properties.find(
                (p: any) =>
                    p.name === 'additionalFields' &&
                    p.displayOptions?.show?.operation?.includes('cancel')
            );

            expect(guestIdField).toBeDefined();
            expect(cancelledByField).toBeDefined();
            expect(additionalFields).toBeDefined();

            // Guest ID and cancelledBy should be required
            expect(guestIdField?.required).toBe(true);
            expect(cancelledByField?.required).toBe(true);
            expect(additionalFields?.required).toBeFalsy();
        });

        it('should have helpful additional fields for cancel operation', async () => {
            const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
            const lumaNode = new Luma();

            const properties = lumaNode.description.properties;
            const cancelAdditionalFields = properties.find(
                (p: any) =>
                    p.name === 'additionalFields' &&
                    p.displayOptions?.show?.operation?.includes('cancel')
            );

            expect(cancelAdditionalFields).toBeDefined();
            expect(cancelAdditionalFields?.type).toBe('collection');
            expect(cancelAdditionalFields?.displayName).toBe(
                'Additional Fields'
            );

            const options = cancelAdditionalFields?.options || [];

            // Check cancellation reason option
            const cancellationReasonOption = options.find(
                (opt: any) => opt.name === 'cancellationReason'
            );
            expect(cancellationReasonOption?.displayName).toBe(
                'Cancellation Reason'
            );
            expect(cancellationReasonOption?.type).toBe('string');
            expect(cancellationReasonOption?.typeOptions?.rows).toBe(3);

            // Check send notification option
            const sendNotificationOption = options.find(
                (opt: any) => opt.name === 'sendNotification'
            );
            expect(sendNotificationOption?.displayName).toBe(
                'Send Notification'
            );
            expect(sendNotificationOption?.type).toBe('boolean');
            expect(sendNotificationOption?.default).toBe(true);

            // Check refund amount option
            const refundAmountOption = options.find(
                (opt: any) => opt.name === 'refundAmount'
            );
            expect(refundAmountOption?.displayName).toBe('Refund Amount');
            expect(refundAmountOption?.type).toBe('number');
            expect(refundAmountOption?.typeOptions?.numberPrecision).toBe(2);
            expect(refundAmountOption?.typeOptions?.minValue).toBe(0);
        });

        it('should have consistent bulk operation support', async () => {
            const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
            const lumaNode = new Luma();

            const properties = lumaNode.description.properties;
            const guestIdField = properties.find(
                (p: any) =>
                    p.name === 'guestId' &&
                    p.displayOptions?.show?.operation?.includes('cancel')
            );

            expect(guestIdField?.placeholder).toContain('multiple');
            expect(guestIdField?.description).toContain('bulk');
            expect(guestIdField?.description).toContain('comma-separated');
        });
    });
});
