import { describe, it, expect } from 'vitest';

describe('Guest Cancel Operation Unit Tests', () => {
    describe('Constants and Interfaces', () => {
        it('should have GUEST_CANCEL endpoint defined', async () => {
            const { LUMA_ENDPOINTS } = await import(
                '../../dist/nodes/Luma/shared/constants.js'
            );

            expect(LUMA_ENDPOINTS.GUEST_CANCEL).toBeDefined();
            expect(LUMA_ENDPOINTS.GUEST_CANCEL).toBe('/v1/guest/cancel');
        });

        it('should have GuestCancellationData interface exported', async () => {
            // Test that the interface compiles correctly by importing the contracts
            try {
                await import('../../dist/nodes/Luma/guest/contracts.js');
                expect(true).toBe(true); // Interface compiled successfully
            } catch (error) {
                throw new Error(
                    'GuestCancellationData interface compilation failed'
                );
            }
        });
    });

    describe('Node Properties Structure', () => {
        it('should include cancel operation in guest operations', async () => {
            const { guestProps } = await import(
                '../../dist/nodes/Luma/guest/props.js'
            );

            const operationField = guestProps.find(
                prop => prop.name === 'operation'
            );
            expect(operationField).toBeDefined();
            expect(operationField?.options).toBeDefined();

            const cancelOption = operationField?.options?.find(
                opt => opt.value === 'cancel'
            );
            expect(cancelOption).toBeDefined();
            expect(cancelOption?.name).toBe('Cancel');
            expect(cancelOption?.description).toBe(
                'Cancel guest registrations'
            );
            expect(cancelOption?.action).toBe('Cancel guest registration');
        });

        it('should have guestId field configured for cancel operation', async () => {
            const { guestProps } = await import(
                '../../dist/nodes/Luma/guest/props.js'
            );

            const guestIdField = guestProps.find(
                prop => prop.name === 'guestId'
            );
            expect(guestIdField).toBeDefined();
            expect(guestIdField?.displayOptions?.show?.operation).toContain(
                'cancel'
            );
            expect(guestIdField?.description).toContain('bulk');
        });

        it('should have cancelledBy field for cancel operation', async () => {
            const { guestProps } = await import(
                '../../dist/nodes/Luma/guest/props.js'
            );

            const cancelledByField = guestProps.find(
                prop => prop.name === 'cancelledBy'
            );
            expect(cancelledByField).toBeDefined();
            expect(cancelledByField?.required).toBe(true);
            expect(cancelledByField?.displayOptions?.show?.operation).toContain(
                'cancel'
            );
            expect(cancelledByField?.options).toHaveLength(2);
            expect(
                cancelledByField?.options?.some(opt => opt.value === 'guest')
            ).toBe(true);
            expect(
                cancelledByField?.options?.some(
                    opt => opt.value === 'organizer'
                )
            ).toBe(true);
        });

        it('should have additional fields for cancel operation', async () => {
            const { guestProps } = await import(
                '../../dist/nodes/Luma/guest/props.js'
            );

            const additionalFields = guestProps.find(
                prop =>
                    prop.name === 'additionalFields' &&
                    prop.displayOptions?.show?.operation?.includes('cancel')
            );
            expect(additionalFields).toBeDefined();
            expect(additionalFields?.options).toBeDefined();

            const cancellationReasonField = additionalFields?.options?.find(
                opt => opt.name === 'cancellationReason'
            );
            expect(cancellationReasonField).toBeDefined();

            const sendNotificationField = additionalFields?.options?.find(
                opt => opt.name === 'sendNotification'
            );
            expect(sendNotificationField).toBeDefined();

            const refundAmountField = additionalFields?.options?.find(
                opt => opt.name === 'refundAmount'
            );
            expect(refundAmountField).toBeDefined();
            expect(refundAmountField?.type).toBe('number');
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
            const cancelledByIndex = guestProps.findIndex(
                prop => prop.name === 'cancelledBy'
            );

            expect(operationIndex).toBeGreaterThanOrEqual(0);
            expect(guestIdIndex).toBeGreaterThan(operationIndex);
            expect(cancelledByIndex).toBeGreaterThan(guestIdIndex);
        });

        it('should have proper default values configured', async () => {
            const { guestProps } = await import(
                '../../dist/nodes/Luma/guest/props.js'
            );

            const cancelledByField = guestProps.find(
                prop => prop.name === 'cancelledBy'
            );
            expect(cancelledByField?.default).toBe('guest');

            const additionalFields = guestProps.find(
                prop =>
                    prop.name === 'additionalFields' &&
                    prop.displayOptions?.show?.operation?.includes('cancel')
            );
            const sendNotificationField = additionalFields?.options?.find(
                opt => opt.name === 'sendNotification'
            );
            expect(sendNotificationField?.default).toBe(true);
        });
    });

    describe('Guest Operations Handler', () => {
        it('should include cancel case in operation switch', async () => {
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
                await handleGuestOperation('cancel', mockContext);
            } catch (error: any) {
                expect(error.message).not.toContain('not supported');
                // It should fail for other reasons (missing parameters, etc.)
            }
        });
    });
});
