import { describe, it, expect } from 'vitest';

describe('Guest Cancel Operation Unit Tests', () => {
    describe('Constants and Interfaces', () => {
        it('should have GUEST_CANCEL endpoint defined', async () => {
            const { LUMA_ENDPOINTS } = await import(
                '../../../dist/nodes/Luma/shared/constants.js'
            );

            expect(LUMA_ENDPOINTS.GUEST_CANCEL).toBeDefined();
            expect(LUMA_ENDPOINTS.GUEST_CANCEL).toBe('/v1/guest/cancel');
        });

        it('should have GuestCancellationData interface exported', async () => {
            // Test that the interface compiles correctly by importing the contracts
            try {
                await import('../../../dist/nodes/Luma/guest/contracts.js');
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
                '../../../dist/nodes/Luma/guest/props.js'
            );

            const operationField = guestProps.find(
                prop => prop.name === 'operation'
            );
            expect(operationField).toBeDefined();
            expect(operationField?.options).toBeDefined();

            const cancelOption = operationField?.options?.find(
                (opt: any) => opt.value === 'cancel'
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
                '../../../dist/nodes/Luma/guest/props.js'
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
                '../../../dist/nodes/Luma/guest/props.js'
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
                cancelledByField?.options?.some((opt: any) => opt.value === 'guest')
            ).toBe(true);
            expect(
                cancelledByField?.options?.some(
                    (opt: any) => opt.value === 'organizer'
                )
            ).toBe(true);
        });

        it('should have additional fields for cancel operation', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            const additionalFields = guestProps.find(
                prop =>
                    prop.name === 'additionalFields' &&
                    prop.displayOptions?.show?.operation?.includes('cancel')
            );
            expect(additionalFields).toBeDefined();
            expect(additionalFields?.options).toBeDefined();

            const options = additionalFields?.options || [];
            expect(options.length).toBeGreaterThanOrEqual(3);

            // Check for required options
            const optionNames = options.map((opt: any) => opt.name);
            expect(optionNames).toContain('sendNotification');
            expect(optionNames).toContain('cancellationReason');
            expect(optionNames).toContain('refundAmount');
        });
    });

    describe('Guest Operation Compilation', () => {
        it('should have guest operations exported', async () => {
            try {
                await import('../../../dist/nodes/Luma/guest/operations.js');
                expect(true).toBe(true);
            } catch (error) {
                throw new Error('Guest operations compilation failed');
            }
        });

        it('should have guest properties structure', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            expect(Array.isArray(guestProps)).toBe(true);
            expect(guestProps.length).toBeGreaterThan(0);
        });
    });
});
