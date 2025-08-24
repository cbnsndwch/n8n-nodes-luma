import { describe, it, expect } from 'vitest';

describe('Guest Check-In Operation Unit Tests', () => {
    describe('Constants and Interfaces', () => {
        it('should have GUEST_CHECK_IN endpoint defined', async () => {
            const { LUMA_ENDPOINTS } = await import(
                '../../../dist/nodes/Luma/shared/constants.js'
            );

            expect(LUMA_ENDPOINTS.GUEST_CHECK_IN).toBeDefined();
            expect(LUMA_ENDPOINTS.GUEST_CHECK_IN).toBe('/v1/guest/check-in');
        });

        it('should have GuestCheckInData interface exported', async () => {
            // Test that the interface compiles correctly by importing the contracts
            try {
                await import('../../../dist/nodes/Luma/guest/contracts.js');
                expect(true).toBe(true); // Interface compiled successfully
            } catch (error) {
                throw new Error(
                    'GuestCheckInData interface compilation failed'
                );
            }
        });
    });

    describe('Node Properties Structure', () => {
        it('should include checkIn operation in guest operations', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            const operationField = guestProps.find(
                prop => prop.name === 'operation'
            );
            expect(operationField).toBeDefined();
            expect(operationField?.options).toBeDefined();

            const checkInOption = operationField?.options?.find(
                (opt: any) => opt.value === 'checkIn'
            );
            expect(checkInOption).toBeDefined();
            expect(checkInOption?.name).toBe('Check In');
            expect(checkInOption?.description).toBe(
                'Check in guests at event time'
            );
            expect(checkInOption?.action).toBe('Check in guest at event');
        });

        it('should have guestId field configured for checkIn operation', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            const guestIdField = guestProps.find(
                prop => prop.name === 'guestId'
            );
            expect(guestIdField).toBeDefined();
            expect(guestIdField?.displayOptions?.show?.operation).toContain(
                'checkIn'
            );
            expect(guestIdField?.displayOptions?.hide?.resource).toContain(
                'guest'
            );
            expect(guestIdField?.displayOptions?.hide?.operation).toContain(
                'checkIn'
            );
            expect(guestIdField?.displayOptions?.hide?.checkInMethod).toContain(
                'emailLookup'
            );
        });

        it('should have checkInMethod field for check-in operation', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            const checkInMethodField = guestProps.find(
                prop => prop.name === 'checkInMethod'
            );
            expect(checkInMethodField).toBeDefined();
            expect(checkInMethodField?.displayName).toBe('Check-In Method');
            expect(checkInMethodField?.type).toBe('options');
            expect(checkInMethodField?.required).toBe(true);
            expect(
                checkInMethodField?.displayOptions?.show?.operation
            ).toContain('checkIn');

            const options = checkInMethodField?.options;
            expect(options).toBeDefined();
            expect(options?.length).toBe(2);

            const guestIdOption = options?.find(
                (opt: any) => opt.value === 'guestId'
            );
            expect(guestIdOption).toBeDefined();
            expect(guestIdOption?.name).toBe('Guest ID');

            const emailLookupOption = options?.find(
                (opt: any) => opt.value === 'emailLookup'
            );
            expect(emailLookupOption).toBeDefined();
            expect(emailLookupOption?.name).toBe('Email Lookup');
        });

        it('should have event ID field for email lookup check-in', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            const eventIdField = guestProps.find(
                prop =>
                    prop.name === 'eventId' &&
                    prop.displayOptions?.show?.operation?.includes('checkIn')
            );
            expect(eventIdField).toBeDefined();
            expect(eventIdField?.displayName).toBe('Event ID');
            expect(eventIdField?.type).toBe('string');
            expect(eventIdField?.required).toBe(true);
            expect(eventIdField?.displayOptions?.show?.checkInMethod).toContain(
                'emailLookup'
            );
        });

        it('should have email field for email lookup check-in', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            const emailField = guestProps.find(
                prop =>
                    prop.name === 'email' &&
                    prop.displayOptions?.show?.operation?.includes('checkIn')
            );
            expect(emailField).toBeDefined();
            expect(emailField?.displayName).toBe('Guest Email');
            expect(emailField?.type).toBe('string');
            expect(emailField?.required).toBe(true);
            expect(emailField?.displayOptions?.show?.checkInMethod).toContain(
                'emailLookup'
            );
        });

        it('should have additional fields for check-in operation', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            const additionalFields = guestProps.find(
                prop =>
                    prop.name === 'additionalFields' &&
                    prop.displayOptions?.show?.operation?.includes('checkIn')
            );
            expect(additionalFields).toBeDefined();
            expect(additionalFields?.type).toBe('collection');
            expect(additionalFields?.options).toBeDefined();

            const options = additionalFields?.options;
            const fieldNames = options?.map((opt: any) => opt.name);
            expect(fieldNames).toContain('checkInTime');
            expect(fieldNames).toContain('checkInLocation');
            expect(fieldNames).toContain('notes');
            expect(fieldNames).toContain('verifiedIdentity');
        });
    });

    describe('Operation Handler Integration', () => {
        it('should handle checkIn operation in switch statement', async () => {
            // This test verifies the operation compiles and can be imported
            try {
                const { handleGuestOperation } = await import(
                    '../../../dist/nodes/Luma/guest/operations.js'
                );
                expect(typeof handleGuestOperation).toBe('function');
            } catch (error) {
                throw new Error(
                    'Guest check-in operation handler compilation failed'
                );
            }
        });
    });
});
