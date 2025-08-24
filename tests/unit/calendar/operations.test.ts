import { describe, it, expect } from 'vitest';

describe('Calendar Operations Unit Tests', () => {
    describe('Calendar Constants', () => {
        it('should have calendar endpoints defined', async () => {
            const { LUMA_ENDPOINTS } = await import(
                '../../../dist/nodes/Luma/shared/constants.js'
            );

            expect(LUMA_ENDPOINTS.CALENDAR_LIST_EVENTS).toBeDefined();
            expect(LUMA_ENDPOINTS.CALENDAR_LIST_EVENTS).toBe(
                '/public/v1/calendar/list-events'
            );
        });
    });

    describe('Calendar Interface Compilation', () => {
        it('should have calendar contracts exported', async () => {
            try {
                await import('../../../dist/nodes/Luma/calendar/contracts.js');
                expect(true).toBe(true);
            } catch (error) {
                throw new Error('Calendar contracts compilation failed');
            }
        });

        it('should have calendar operations exported', async () => {
            try {
                await import('../../../dist/nodes/Luma/calendar/operations.js');
                expect(true).toBe(true);
            } catch (error) {
                throw new Error('Calendar operations compilation failed');
            }
        });
    });

    describe('Calendar Properties Structure', () => {
        it('should have calendar operation properties', async () => {
            const { calendarProps } = await import(
                '../../../dist/nodes/Luma/calendar/props.js'
            );

            expect(Array.isArray(calendarProps)).toBe(true);
            expect(calendarProps.length).toBeGreaterThan(0);
        });

        it('should have calendar operation field', async () => {
            const { calendarProps } = await import(
                '../../../dist/nodes/Luma/calendar/props.js'
            );

            const operationField = calendarProps.find(
                prop => prop.name === 'operation'
            );
            expect(operationField).toBeDefined();
            expect(operationField?.type).toBe('options');
            expect(operationField?.options).toBeDefined();
        });

        it('should have calendar-specific display options', async () => {
            const { calendarProps } = await import(
                '../../../dist/nodes/Luma/calendar/props.js'
            );

            const calendarSpecificProps = calendarProps.filter(prop =>
                prop.displayOptions?.show?.resource?.includes('calendar')
            );

            expect(calendarSpecificProps.length).toBeGreaterThan(0);
        });
    });
});
