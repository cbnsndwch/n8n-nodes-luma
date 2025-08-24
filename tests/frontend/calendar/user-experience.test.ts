import { describe, it, expect } from 'vitest';

describe('Calendar Frontend User Experience', () => {
    describe('Calendar Parameter Structure', () => {
        it('should have user-friendly calendar properties', async () => {
            const { calendarProps } = await import(
                '../../../dist/nodes/Luma/calendar/props.js'
            );

            expect(Array.isArray(calendarProps)).toBe(true);
            expect(calendarProps.length).toBeGreaterThan(0);
            
            // Check for operation property
            const operationProp = calendarProps.find(prop => prop.name === 'operation');
            expect(operationProp).toBeDefined();
            expect(operationProp?.displayName).toBeDefined();
        });

        it('should have clear operation labeling', async () => {
            const { calendarProps } = await import(
                '../../../dist/nodes/Luma/calendar/props.js'
            );

            const operationField = calendarProps.find(prop => prop.name === 'operation');
            expect(operationField?.displayName).toBe('Operation');
            expect(operationField?.type).toBe('options');
            expect(operationField?.options).toBeDefined();
        });
    });

    describe('Calendar Display Options', () => {
        it('should have proper conditional display logic', async () => {
            const { calendarProps } = await import(
                '../../../dist/nodes/Luma/calendar/props.js'
            );

            // Test display options for calendar-specific fields
            const calendarSpecificProps = calendarProps.filter(
                prop => prop.displayOptions?.show?.resource?.includes('calendar')
            );
            
            expect(calendarSpecificProps.length).toBeGreaterThan(0);
        });

        it('should have operation-specific parameter visibility', async () => {
            const { calendarProps } = await import(
                '../../../dist/nodes/Luma/calendar/props.js'
            );

            // Check for operation-specific parameters
            const operationSpecificProps = calendarProps.filter(
                prop => prop.displayOptions?.show?.operation
            );
            expect(operationSpecificProps.length).toBeGreaterThan(0);
        });
    });

    describe('Calendar Field Labels', () => {
        it('should have intuitive field names', async () => {
            const { calendarProps } = await import(
                '../../../dist/nodes/Luma/calendar/props.js'
            );

            // Check for common calendar fields that should have good UX
            const operationField = calendarProps.find(prop => prop.name === 'operation');
            expect(operationField?.displayName).toBe('Operation');

            // Look for additional fields that might be calendar-specific
            const fieldsWithDisplayNames = calendarProps.filter(
                prop => prop.displayName && prop.displayName.length > 0
            );
            expect(fieldsWithDisplayNames.length).toBeGreaterThan(0);
        });
    });
});
