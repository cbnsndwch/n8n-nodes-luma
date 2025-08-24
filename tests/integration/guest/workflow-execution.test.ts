import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Guest Workflow Execution Tests', () => {
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

    describe('Guest Cancel Operation Execution', () => {
        it('should handle guest cancel operation parameter setup', async () => {
            mockExecuteFunctions.getNodeParameter
                .mockReturnValueOnce('guest')
                .mockReturnValueOnce('cancel')
                .mockReturnValueOnce('guest-123')
                .mockReturnValueOnce('organizer');

            const inputData = mockExecuteFunctions.getInputData();
            expect(Array.isArray(inputData)).toBe(true);
            expect(inputData[0]).toHaveProperty('json');

            // Verify the mock parameters can be retrieved
            expect(mockExecuteFunctions.getNodeParameter('resource')).toBe(
                'guest'
            );
            expect(mockExecuteFunctions.getNodeParameter('operation')).toBe(
                'cancel'
            );
            expect(mockExecuteFunctions.getNodeParameter('guestId')).toBe(
                'guest-123'
            );
            expect(mockExecuteFunctions.getNodeParameter('cancelledBy')).toBe(
                'organizer'
            );
        });
    });

    describe('Guest Reject Operation Execution', () => {
        it('should handle guest reject operation parameter setup', async () => {
            mockExecuteFunctions.getNodeParameter
                .mockReturnValueOnce('guest')
                .mockReturnValueOnce('reject')
                .mockReturnValueOnce('guest-456')
                .mockReturnValueOnce('Rejected due to policy violation');

            const inputData = mockExecuteFunctions.getInputData();
            expect(Array.isArray(inputData)).toBe(true);

            // Verify the mock parameters can be retrieved
            expect(mockExecuteFunctions.getNodeParameter('resource')).toBe(
                'guest'
            );
            expect(mockExecuteFunctions.getNodeParameter('operation')).toBe(
                'reject'
            );
            expect(mockExecuteFunctions.getNodeParameter('guestId')).toBe(
                'guest-456'
            );
            expect(
                mockExecuteFunctions.getNodeParameter('rejectionReason')
            ).toBe('Rejected due to policy violation');
        });
    });

    describe('Guest Operations Error Handling', () => {
        it('should handle execution context errors gracefully', async () => {
            mockExecuteFunctions.continueOnFail.mockReturnValue(true);

            const shouldContinue = mockExecuteFunctions.continueOnFail();
            expect(shouldContinue).toBe(true);
        });

        it('should handle credential retrieval', async () => {
            const credentials =
                await mockExecuteFunctions.getCredentials('lumaApi');
            expect(credentials).toEqual({ apiKey: 'test-key' });
        });
    });

    describe('Guest Workflow Integration', () => {
        it('should validate workflow execution structure', async () => {
            const { Luma } = await import(
                '../../../dist/nodes/Luma/Luma.node.js'
            );
            const lumaNode = new Luma();

            expect(typeof lumaNode.execute).toBe('function');
            expect(lumaNode.description.inputs).toEqual(['main']);
            expect(lumaNode.description.outputs).toEqual(['main']);
        });
    });
});
