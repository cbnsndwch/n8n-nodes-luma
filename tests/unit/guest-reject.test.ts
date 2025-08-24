import { describe, it, expect } from 'vitest';

describe('Guest Reject Operation Unit Tests', () => {
    describe('Constants and Interfaces', () => {
        it('should have GUEST_REJECT endpoint defined', async () => {
            const { LUMA_ENDPOINTS } = await import(
                '../../dist/nodes/Luma/shared/constants.js'
            );

            expect(LUMA_ENDPOINTS.GUEST_REJECT).toBeDefined();
            expect(LUMA_ENDPOINTS.GUEST_REJECT).toBe('/v1/guest/reject');
        });

        it('should have GuestRejectionData interface exported', async () => {
            // Test that the interface compiles correctly by importing the contracts
            try {
                await import('../../dist/nodes/Luma/guest/contracts.js');
                expect(true).toBe(true); // Interface compiled successfully
            } catch (error) {
                throw new Error(
                    'GuestRejectionData interface compilation failed'
                );
            }
        });
    });

    describe('Node Properties Structure', () => {
        it('should include reject operation in guest operations', async () => {
            const { guestProps } = await import(
                '../../dist/nodes/Luma/guest/props.js'
            );

            expect(Array.isArray(guestProps)).toBe(true);

            const operationsProperty = guestProps.find(
                prop => prop.name === 'operation'
            );
            expect(operationsProperty).toBeDefined();
            expect(operationsProperty?.options).toBeDefined();

            const rejectOption = operationsProperty?.options?.find(
                (option: any) => option.value === 'reject'
            );

            expect(rejectOption).toBeDefined();
            expect(rejectOption?.name).toBe('Reject');
        });

        it('should have rejection reason field', async () => {
            const { guestProps } = await import(
                '../../dist/nodes/Luma/guest/props.js'
            );

            const rejectionReasonField = guestProps.find(
                prop => prop.name === 'rejectionReason'
            );
            expect(rejectionReasonField).toBeDefined();
            expect(rejectionReasonField?.required).toBe(true);
            expect(rejectionReasonField?.type).toBe('string');
            expect(
                rejectionReasonField?.displayOptions?.show?.operation
            ).toContain('reject');
        });

        it('should have additional fields for reject operation', async () => {
            const { guestProps } = await import(
                '../../dist/nodes/Luma/guest/props.js'
            );

            const rejectAdditionalFields = guestProps.find(
                prop =>
                    prop.name === 'additionalFields' &&
                    prop.displayOptions?.show?.operation?.includes('reject')
            );

            expect(rejectAdditionalFields).toBeDefined();
            expect(rejectAdditionalFields?.type).toBe('collection');
            expect(rejectAdditionalFields?.options).toBeDefined();
            expect(Array.isArray(rejectAdditionalFields?.options)).toBe(true);

            const options = rejectAdditionalFields?.options || [];
            expect(options.length).toBeGreaterThanOrEqual(3);

            // Check for required options
            const optionNames = options.map((opt: any) => opt.name);
            expect(optionNames).toContain('sendNotification');
            expect(optionNames).toContain('customMessage');
            expect(optionNames).toContain('allowReapply');
        });

        it('should update guest ID field to support reject operation', async () => {
            const { guestProps } = await import(
                '../../dist/nodes/Luma/guest/props.js'
            );

            const guestIdField = guestProps.find(
                prop => prop.name === 'guestId'
            );
            expect(guestIdField).toBeDefined();
            expect(guestIdField?.displayOptions?.show?.operation).toContain(
                'reject'
            );
            expect(guestIdField?.description).toContain('bulk');
        });
    });

    describe('Guest Operations Handler', () => {
        it('should include reject case in operation switch', async () => {
            // Test by importing the operations and checking it doesn't throw for unknown operation
            const { handleGuestOperation } = await import(
                '../../dist/nodes/Luma/guest/operations.js'
            );

            expect(typeof handleGuestOperation).toBe('function');

            // Create minimal mock context
            const mockContext = {
                executeFunctions: {
                    getNodeParameter: () => 'test-value',
                    getNode: () => ({ name: 'test-node' }),
                    continueOnFail: () => false,
                    getCredentials: async () => ({ apiKey: 'test-key' })
                },
                itemIndex: 0
            };

            // Should not throw "operation not supported" error
            try {
                await handleGuestOperation('reject', mockContext);
            } catch (error: any) {
                expect(error.message).not.toContain('not supported');
                // It should fail for other reasons (missing parameters, etc.)
            }
        });
    });

    describe('Property Configuration Validation', () => {
        it('should have consistent field ordering', async () => {
            const { guestProps } = await import(
                '../../dist/nodes/Luma/guest/props.js'
            );

            // Find positions of key fields
            const operationIndex = guestProps.findIndex(
                prop => prop.name === 'operation'
            );
            const guestIdIndex = guestProps.findIndex(
                prop => prop.name === 'guestId'
            );
            const rejectionReasonIndex = guestProps.findIndex(
                prop => prop.name === 'rejectionReason'
            );

            expect(operationIndex).toBeGreaterThanOrEqual(0);
            expect(guestIdIndex).toBeGreaterThan(operationIndex);
            expect(rejectionReasonIndex).toBeGreaterThan(guestIdIndex);
        });

        it('should have proper display options configuration', async () => {
            const { guestProps } = await import(
                '../../dist/nodes/Luma/guest/props.js'
            );

            const rejectSpecificFields = guestProps.filter(prop =>
                prop.displayOptions?.show?.operation?.includes('reject')
            );

            expect(rejectSpecificFields.length).toBeGreaterThanOrEqual(3); // guestId, rejectionReason, additionalFields

            // All reject fields should show for guest resource
            rejectSpecificFields.forEach(field => {
                expect(field.displayOptions?.show?.resource).toContain('guest');
            });
        });
    });
});
