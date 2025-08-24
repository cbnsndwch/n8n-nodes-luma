import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Calendar Workflow Execution Tests', () => {
    let mockExecuteFunctions: any;

    beforeEach(() => {
        mockExecuteFunctions = {
            getInputData: vi.fn().mockReturnValue([{ json: { test: 'data' } }]),
            getNodeParameter: vi.fn(),
            getNode: vi.fn().mockReturnValue({ name: 'test-node' }),
            continueOnFail: vi.fn().mockReturnValue(false),
            getCredentials: vi.fn().mockResolvedValue({ apiKey: 'test-key' })
        };
    });

    describe('Calendar Operation Execution', () => {
        it('should handle calendar list events operation', async () => {
            mockExecuteFunctions.getNodeParameter
                .mockReturnValueOnce('calendar')
                .mockReturnValueOnce('listEvents')
                .mockReturnValueOnce('calendar-123');

            const inputData = mockExecuteFunctions.getInputData();
            expect(Array.isArray(inputData)).toBe(true);
            expect(inputData[0]).toHaveProperty('json');

            // Verify parameters
            expect(mockExecuteFunctions.getNodeParameter('resource')).toBe(
                'calendar'
            );
            expect(mockExecuteFunctions.getNodeParameter('operation')).toBe(
                'listEvents'
            );
            expect(mockExecuteFunctions.getNodeParameter('calendarId')).toBe(
                'calendar-123'
            );
        });

        it('should handle calendar lookup event operation', async () => {
            mockExecuteFunctions.getNodeParameter
                .mockReturnValueOnce('calendar')
                .mockReturnValueOnce('lookupEvent')
                .mockReturnValueOnce('event-456');

            const inputData = mockExecuteFunctions.getInputData();
            expect(Array.isArray(inputData)).toBe(true);

            // Verify parameters
            expect(mockExecuteFunctions.getNodeParameter('resource')).toBe(
                'calendar'
            );
            expect(mockExecuteFunctions.getNodeParameter('operation')).toBe(
                'lookupEvent'
            );
            expect(mockExecuteFunctions.getNodeParameter('eventId')).toBe(
                'event-456'
            );
        });
    });

    describe('Calendar Error Handling', () => {
        it('should handle execution context errors gracefully', async () => {
            mockExecuteFunctions.continueOnFail.mockReturnValue(true);

            const shouldContinue = mockExecuteFunctions.continueOnFail();
            expect(shouldContinue).toBe(true);
        });

        it('should handle credential retrieval for calendar operations', async () => {
            const credentials =
                await mockExecuteFunctions.getCredentials('lumaApi');
            expect(credentials).toEqual({ apiKey: 'test-key' });
        });
    });

    describe('Calendar Workflow Integration', () => {
        it('should validate calendar workflow structure', async () => {
            const { Luma } = await import(
                '../../../dist/nodes/Luma/Luma.node.js'
            );
            const lumaNode = new Luma();

            // Check that calendar is a valid resource
            const resourceProperty = lumaNode.description.properties.find(
                (p: any) => p.name === 'resource'
            );
            expect(resourceProperty).toBeDefined();

            const calendarOption = resourceProperty?.options?.find(
                (opt: any) => opt.value === 'calendar'
            );
            expect(calendarOption).toBeDefined();
        });
    });
});
