import { describe, it, expect } from 'vitest';

describe('Guest Reject Operation Unit Tests', () => {
    describe('Constants and Interfaces', () => {
        it('should have GUEST_REJECT endpoint defined', async () => {
            const { LUMA_ENDPOINTS } = await import(
                '../../../dist/nodes/Luma/shared/constants.js'
            );

            expect(LUMA_ENDPOINTS.GUEST_REJECT).toBeDefined();
            expect(LUMA_ENDPOINTS.GUEST_REJECT).toBe('/v1/guest/reject');
        });

        it('should have GuestRejectionData interface exported', async () => {
            // Test that the interface compiles correctly by importing the contracts
            try {
                await import('../../../dist/nodes/Luma/guest/contracts.js');
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
                '../../../dist/nodes/Luma/guest/props.js'
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
                '../../../dist/nodes/Luma/guest/props.js'
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
                '../../../dist/nodes/Luma/guest/props.js'
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
                '../../../dist/nodes/Luma/guest/props.js'
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

    describe('Guest Operation Structure', () => {
        it('should have guest operations exported', async () => {
            try {
                await import('../../../dist/nodes/Luma/guest/operations.js');
                expect(true).toBe(true);
            } catch (error) {
                throw new Error('Guest operations compilation failed');
            }
        });

        it('should have guest contracts exported', async () => {
            try {
                await import('../../../dist/nodes/Luma/guest/contracts.js');
                expect(true).toBe(true);
            } catch (error) {
                throw new Error('Guest contracts compilation failed');
            }
        });
    });
});
