import * as fs from 'fs';
import { describe, expect, it } from 'vitest';

describe('Ticket Operations Unit Tests', () => {
    describe('Source Files', () => {
        it('should have ticket operations files', () => {
            expect(fs.existsSync('nodes/Luma/ticket/contracts.ts')).toBe(true);
            expect(fs.existsSync('nodes/Luma/ticket/operations.ts')).toBe(true);
            expect(fs.existsSync('nodes/Luma/ticket/props.ts')).toBe(true);
        });

        it('should have built ticket operation files', () => {
            expect(fs.existsSync('dist/nodes/Luma/ticket/contracts.js')).toBe(
                true
            );
            expect(fs.existsSync('dist/nodes/Luma/ticket/operations.js')).toBe(
                true
            );
            expect(fs.existsSync('dist/nodes/Luma/ticket/props.js')).toBe(true);
        });
    });

    describe('Ticket Interface Compilation', () => {
        it('should have ticket contracts exported', async () => {
            try {
                await import('../../../dist/nodes/Luma/ticket/contracts.js');
                expect(true).toBe(true);
            } catch (error) {
                throw new Error('Ticket contracts compilation failed');
            }
        });

        it('should have ticket operations exported', async () => {
            try {
                await import('../../../dist/nodes/Luma/ticket/operations.js');
                expect(true).toBe(true);
            } catch (error) {
                throw new Error('Ticket operations compilation failed');
            }
        });
    });

    describe('Ticket Properties Structure', () => {
        it('should have ticket operation properties', async () => {
            const { ticketProps } = await import(
                '../../../dist/nodes/Luma/ticket/props.js'
            );

            expect(Array.isArray(ticketProps)).toBe(true);
            expect(ticketProps.length).toBeGreaterThan(0);
        });

        it('should have ticket operation field', async () => {
            const { ticketProps } = await import(
                '../../../dist/nodes/Luma/ticket/props.js'
            );

            const operationField = ticketProps.find(
                prop => prop.name === 'operation'
            );
            expect(operationField).toBeDefined();
            expect(operationField?.type).toBe('options');
            expect(operationField?.options).toBeDefined();
        });
    });

    describe('Ticket Constants', () => {
        it('should have ticket endpoints defined', async () => {
            const { LUMA_ENDPOINTS } = await import(
                '../../../dist/nodes/Luma/shared/constants.js'
            );

            // Check for common ticket endpoints
            expect(LUMA_ENDPOINTS.TICKET_TYPES_LIST).toBeDefined();
            expect(LUMA_ENDPOINTS.TICKET_TYPES_LIST).toBe(
                '/public/v1/event/ticket-types/list'
            );

            // Check for analytics endpoint
            expect(LUMA_ENDPOINTS.TICKET_ANALYTICS).toBeDefined();
            expect(LUMA_ENDPOINTS.TICKET_ANALYTICS).toBe(
                '/public/v1/event/ticket-types/analytics'
            );
        });
    });

    describe('Ticket Analytics Interface', () => {
        it('should have analytics operation defined', async () => {
            const { ticketProps } = await import(
                '../../../dist/nodes/Luma/ticket/props.js'
            );

            const operationField = ticketProps.find(
                prop => prop.name === 'operation'
            );
            expect(operationField).toBeDefined();
            expect(operationField?.options).toBeDefined();

            const analyticsOption = operationField?.options?.find(
                (option: any) => option.value === 'analytics'
            );
            expect(analyticsOption).toBeDefined();
            expect(analyticsOption?.name).toBe('Get Ticket Analytics');
        });

        it('should have analytics parameter fields', async () => {
            const { LUMA_ENDPOINTS } = await import(
                '../../../dist/nodes/Luma/shared/constants.js'
            );
            const { ticketProps } = await import(
                '../../../dist/nodes/Luma/ticket/props.js'
            );

            // Check for analytics event ID field
            const analyticsEventIdField = ticketProps.find(
                prop =>
                    prop.name === 'eventId' &&
                    prop.displayOptions?.show?.operation?.includes('analytics')
            );
            expect(analyticsEventIdField).toBeDefined();

            // Check for analytics ticket type ID field
            const analyticsTicketTypeIdField = ticketProps.find(
                prop =>
                    prop.name === 'ticketTypeId' &&
                    prop.displayOptions?.show?.operation?.includes('analytics')
            );
            expect(analyticsTicketTypeIdField).toBeDefined();
            expect(LUMA_ENDPOINTS.TICKET_TYPE_DELETE).toBeDefined();
            expect(LUMA_ENDPOINTS.TICKET_TYPE_DELETE).toBe(
                '/public/v1/event/ticket-types/delete'
            );
        });

        it('should have delete operation in ticket props', async () => {
            const { ticketProps } = await import(
                '../../../dist/nodes/Luma/ticket/props.js'
            );

            const operationField = ticketProps.find(
                prop => prop.name === 'operation'
            );
            expect(operationField).toBeDefined();
            expect(operationField?.options).toBeDefined();

            const deleteOption = operationField?.options?.find(
                (opt: any) => opt.value === 'delete'
            );
            expect(deleteOption).toBeDefined();
            expect(deleteOption?.name).toBe('Delete Ticket Type');
        });

        it('should have bulk update endpoint defined', async () => {
            const { LUMA_ENDPOINTS } = await import(
                '../../../dist/nodes/Luma/shared/constants.js'
            );

            expect(LUMA_ENDPOINTS.TICKET_TYPES_BULK_UPDATE).toBeDefined();
            expect(LUMA_ENDPOINTS.TICKET_TYPES_BULK_UPDATE).toBe(
                '/v1/event/ticket-types/bulk-update'
            );
        });
    });

    describe('Bulk Update Operation', () => {
        it('should have bulk update operation option', async () => {
            const { ticketProps } = await import(
                '../../../dist/nodes/Luma/ticket/props.js'
            );

            const operationField = ticketProps.find(
                prop => prop.name === 'operation'
            );
            expect(operationField).toBeDefined();
            expect(operationField?.options).toBeDefined();

            const bulkUpdateOption = operationField?.options?.find(
                (opt: any) => opt.value === 'bulkUpdate'
            );
            expect(bulkUpdateOption).toBeDefined();
            expect(bulkUpdateOption?.name).toBe('Bulk Update Ticket Types');
        });

        it('should have required bulk update parameters', async () => {
            const { ticketProps } = await import(
                '../../../dist/nodes/Luma/ticket/props.js'
            );

            // Check for ticket type IDs field
            const ticketTypeIdsField = ticketProps.find(
                prop => prop.name === 'ticketTypeIds'
            );
            expect(ticketTypeIdsField).toBeDefined();
            expect(ticketTypeIdsField?.required).toBe(true);
            expect(
                ticketTypeIdsField?.displayOptions?.show?.operation
            ).toContain('bulkUpdate');

            // Check for update type field
            const updateTypeField = ticketProps.find(
                prop => prop.name === 'updateType'
            );
            expect(updateTypeField).toBeDefined();
            expect(updateTypeField?.required).toBe(true);
            expect(updateTypeField?.type).toBe('options');
        });

        it('should have bulk update contracts defined', async () => {
            try {
                const contracts = await import(
                    '../../../dist/nodes/Luma/ticket/contracts.js'
                );

                // These should be available as type exports, so we just verify the module loads
                expect(contracts).toBeDefined();
            } catch (error) {
                throw new Error('Bulk update contracts should be compilable');
            }
        });

        it('should have update ticket endpoint defined', async () => {
            const { LUMA_ENDPOINTS } = await import(
                '../../../dist/nodes/Luma/shared/constants.js'
            );

            expect(LUMA_ENDPOINTS.TICKET_TYPE_UPDATE).toBeDefined();
            expect(LUMA_ENDPOINTS.TICKET_TYPE_UPDATE).toBe(
                '/v1/event/ticket-types/update'
            );
        });
    });

    describe('Update Operation Support', () => {
        it('should include update operation in ticket operations', async () => {
            const { ticketProps } = await import(
                '../../../dist/nodes/Luma/ticket/props.js'
            );

            const operationField = ticketProps.find(
                prop => prop.name === 'operation'
            );
            expect(operationField).toBeDefined();
            expect(operationField?.options).toBeDefined();

            const updateOption = operationField?.options?.find(
                (opt: any) => opt.value === 'update'
            );
            expect(updateOption).toBeDefined();
            expect(updateOption?.name).toBe('Update Ticket Type Configuration');
        });

        it('should have update-specific fields', async () => {
            const { ticketProps } = await import(
                '../../../dist/nodes/Luma/ticket/props.js'
            );

            // Check for ticketTypeId field for update operation
            const ticketTypeIdField = ticketProps.find(
                prop =>
                    prop.name === 'ticketTypeId' &&
                    prop.displayOptions?.show?.operation?.includes('update')
            );
            expect(ticketTypeIdField).toBeDefined();
            expect(
                ticketTypeIdField?.displayOptions?.show?.operation
            ).toContain('update');

            // Check for updateFields collection for update operation
            const updateFieldsCollection = ticketProps.find(
                prop =>
                    prop.name === 'updateFields' &&
                    prop.displayOptions?.show?.operation?.includes('update')
            );
            expect(updateFieldsCollection).toBeDefined();
            expect(updateFieldsCollection?.type).toBe('collection');
            expect(
                updateFieldsCollection?.displayOptions?.show?.operation
            ).toContain('update');
        });
    });
});
