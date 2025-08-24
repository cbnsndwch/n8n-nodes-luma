import { describe, it, expect } from 'vitest';

describe('Ticket Frontend User Experience', () => {
    describe('Ticket Parameter Structure', () => {
        it('should have user-friendly ticket properties', async () => {
            const { ticketProps } = await import(
                '../../../dist/nodes/Luma/ticket/props.js'
            );

            expect(Array.isArray(ticketProps)).toBe(true);
            expect(ticketProps.length).toBeGreaterThan(0);

            // Check for operation property
            const operationProp = ticketProps.find(
                prop => prop.name === 'operation'
            );
            expect(operationProp).toBeDefined();
            expect(operationProp?.displayName).toBeDefined();
        });

        it('should have clear operation labeling', async () => {
            const { ticketProps } = await import(
                '../../../dist/nodes/Luma/ticket/props.js'
            );

            const operationField = ticketProps.find(
                prop => prop.name === 'operation'
            );
            expect(operationField?.displayName).toBe('Operation');
            expect(operationField?.type).toBe('options');
            expect(operationField?.options).toBeDefined();
        });
    });

    describe('Ticket Display Options', () => {
        it('should have proper conditional display logic', async () => {
            const { ticketProps } = await import(
                '../../../dist/nodes/Luma/ticket/props.js'
            );

            // Test display options for ticket-specific fields
            const ticketSpecificProps = ticketProps.filter(prop =>
                prop.displayOptions?.show?.resource?.includes('ticket')
            );

            expect(ticketSpecificProps.length).toBeGreaterThan(0);
        });

        it('should have operation-specific parameter visibility', async () => {
            const { ticketProps } = await import(
                '../../../dist/nodes/Luma/ticket/props.js'
            );

            // Check for operation-specific parameters
            const operationSpecificProps = ticketProps.filter(
                prop => prop.displayOptions?.show?.operation
            );
            expect(operationSpecificProps.length).toBeGreaterThan(0);
        });
    });

    describe('Ticket Field Labels', () => {
        it('should have intuitive field names', async () => {
            const { ticketProps } = await import(
                '../../../dist/nodes/Luma/ticket/props.js'
            );

            // Check for common ticket fields that should have good UX
            const operationField = ticketProps.find(
                prop => prop.name === 'operation'
            );
            expect(operationField?.displayName).toBe('Operation');

            // Look for additional fields that might be ticket-specific
            const fieldsWithDisplayNames = ticketProps.filter(
                prop => prop.displayName && prop.displayName.length > 0
            );
            expect(fieldsWithDisplayNames.length).toBeGreaterThan(0);
        });

        it('should have helpful descriptions for complex fields', async () => {
            const { ticketProps } = await import(
                '../../../dist/nodes/Luma/ticket/props.js'
            );

            // Check that complex fields have descriptions to help users
            const fieldsWithDescriptions = ticketProps.filter(
                prop => prop.description && prop.description.length > 0
            );
            expect(fieldsWithDescriptions.length).toBeGreaterThan(0);
        });
    });

    describe('Bulk Update User Experience', () => {
        it('should have bulk update operation option', async () => {
            const { ticketProps } = await import(
                '../../../dist/nodes/Luma/ticket/props.js'
            );

            const operationField = ticketProps.find(
                prop => prop.name === 'operation'
            );
            expect(operationField?.options).toBeDefined();

            const bulkUpdateOption = operationField?.options?.find(
                (opt: any) => opt.value === 'bulkUpdate'
            );
            expect(bulkUpdateOption).toBeDefined();
            expect(bulkUpdateOption?.name).toBe('Bulk Update Ticket Types');
            expect(bulkUpdateOption?.action).toBe('Bulk update ticket types');
        });

        it('should have user-friendly bulk update parameter structure', async () => {
            const { ticketProps } = await import(
                '../../../dist/nodes/Luma/ticket/props.js'
            );

            // Check ticket type IDs field
            const ticketTypeIdsField = ticketProps.find(
                prop => prop.name === 'ticketTypeIds'
            );
            expect(ticketTypeIdsField).toBeDefined();
            expect(ticketTypeIdsField?.displayName).toBe('Ticket Type IDs');
            expect(ticketTypeIdsField?.description).toContain(
                'Comma-separated'
            );

            // Check update type field
            const updateTypeField = ticketProps.find(
                prop => prop.name === 'updateType'
            );
            expect(updateTypeField).toBeDefined();
            expect(updateTypeField?.displayName).toBe('Update Type');
            expect(updateTypeField?.type).toBe('options');
            expect(updateTypeField?.options).toBeDefined();
            expect(updateTypeField?.options?.length).toBe(3); // percentage_change, fixed_change, absolute_value
        });

        it('should have properly structured update fields collection', async () => {
            const { ticketProps } = await import(
                '../../../dist/nodes/Luma/ticket/props.js'
            );

            const updateFieldsCollection = ticketProps.find(
                prop => prop.name === 'updateFields'
            );
            expect(updateFieldsCollection).toBeDefined();
            expect(updateFieldsCollection?.type).toBe('collection');
            expect(updateFieldsCollection?.displayName).toBe('Update Fields');
            expect(updateFieldsCollection?.options).toBeDefined();
            expect(updateFieldsCollection?.options?.length).toBe(4); // priceChange, capacityChange, saleEndAt, isHidden
        });

        it('should have conditional field visibility for bulk update', async () => {
            const { ticketProps } = await import(
                '../../../dist/nodes/Luma/ticket/props.js'
            );

            // Find fields that should only show for bulk update operation
            const bulkUpdateSpecificFields = ticketProps.filter(prop =>
                prop.displayOptions?.show?.operation?.includes('bulkUpdate')
            );

            expect(bulkUpdateSpecificFields.length).toBeGreaterThan(0);

            // Verify key bulk update fields are present
            const ticketTypeIdsField = bulkUpdateSpecificFields.find(
                prop => prop.name === 'ticketTypeIds'
            );
            const updateTypeField = bulkUpdateSpecificFields.find(
                prop => prop.name === 'updateType'
            );
            const updateFieldsField = bulkUpdateSpecificFields.find(
                prop => prop.name === 'updateFields'
            );

            expect(ticketTypeIdsField).toBeDefined();
            expect(updateTypeField).toBeDefined();
            expect(updateFieldsField).toBeDefined();
        });

        it('should have helpful boolean descriptions starting with "Whether"', async () => {
            const { ticketProps } = await import(
                '../../../dist/nodes/Luma/ticket/props.js'
            );

            // Find additional fields collection for bulk update
            const bulkUpdateAdditionalFields = ticketProps.find(
                prop =>
                    prop.name === 'additionalFields' &&
                    prop.displayOptions?.show?.operation?.includes('bulkUpdate')
            );

            expect(bulkUpdateAdditionalFields).toBeDefined();
            expect(bulkUpdateAdditionalFields?.options).toBeDefined();

            // Check boolean fields have proper descriptions
            const booleanOptions = bulkUpdateAdditionalFields?.options?.filter(
                (opt: any) => opt.type === 'boolean'
            );

            expect(booleanOptions?.length).toBeGreaterThan(0);
            booleanOptions?.forEach((opt: any) => {
                expect(opt.description).toMatch(/^Whether to /);
            });
        });
    });
});
