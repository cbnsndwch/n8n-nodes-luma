import { describe, it, expect } from 'vitest';

describe('Event Operations Unit Tests', () => {
    describe('Event Constants', () => {
        it('should have event endpoints defined', async () => {
            const { LUMA_ENDPOINTS } = await import(
                '../../../dist/nodes/Luma/shared/constants.js'
            );

            expect(LUMA_ENDPOINTS.EVENT_GET).toBeDefined();
            expect(LUMA_ENDPOINTS.EVENT_CREATE).toBeDefined();
            expect(LUMA_ENDPOINTS.EVENT_UPDATE).toBeDefined();
            expect(LUMA_ENDPOINTS.EVENT_DELETE).toBeDefined();
        });
    });

    describe('Event Interface Compilation', () => {
        it('should have event contracts exported', async () => {
            try {
                await import('../../../dist/nodes/Luma/event/contracts.js');
                expect(true).toBe(true);
            } catch (error) {
                throw new Error('Event contracts compilation failed');
            }
        });

        it('should have event operations exported', async () => {
            try {
                await import('../../../dist/nodes/Luma/event/operations.js');
                expect(true).toBe(true);
            } catch (error) {
                throw new Error('Event operations compilation failed');
            }
        });
    });

    describe('Event Properties Structure', () => {
        it('should have event operation properties', async () => {
            const { eventProps } = await import(
                '../../../dist/nodes/Luma/event/props.js'
            );

            expect(Array.isArray(eventProps)).toBe(true);
            expect(eventProps.length).toBeGreaterThan(0);
        });

        it('should have event operation field', async () => {
            const { eventProps } = await import(
                '../../../dist/nodes/Luma/event/props.js'
            );

            const operationField = eventProps.find(
                prop => prop.name === 'operation'
            );
            expect(operationField).toBeDefined();
            expect(operationField?.type).toBe('options');
            expect(operationField?.options).toBeDefined();
        });

        it('should have event-specific display options', async () => {
            const { eventProps } = await import(
                '../../../dist/nodes/Luma/event/props.js'
            );

            const eventSpecificProps = eventProps.filter(
                prop => prop.displayOptions?.show?.resource?.includes('event')
            );
            
            expect(eventSpecificProps.length).toBeGreaterThan(0);
        });
    });
});
