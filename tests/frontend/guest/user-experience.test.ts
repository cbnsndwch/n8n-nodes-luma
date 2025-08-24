import { describe, it, expect } from 'vitest';

describe('Guest Frontend User Experience', () => {
    describe('Guest Parameter Structure', () => {
        it('should have user-friendly guest properties', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            expect(Array.isArray(guestProps)).toBe(true);
            expect(guestProps.length).toBeGreaterThan(0);

            const operationProp = guestProps.find(
                prop => prop.name === 'operation'
            );
            expect(operationProp).toBeDefined();
            expect(operationProp?.options).toBeDefined();
        });

        it('should have clear operation labeling', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            const operationField = guestProps.find(
                prop => prop.name === 'operation'
            );
            expect(operationField?.displayName).toBe('Operation');
            expect(operationField?.type).toBe('options');
        });
    });

    describe('Guest Cancel UX', () => {
        it('should have clear cancel operation labeling', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            const operationField = guestProps.find(
                prop => prop.name === 'operation'
            );
            const cancelOption = operationField?.options?.find(
                (opt: any) => opt.value === 'cancel'
            );

            expect(cancelOption?.name).toBe('Cancel');
            expect((cancelOption as any)?.description).toContain('Cancel');
            expect((cancelOption as any)?.action).toContain('Cancel');
        });

        it('should have intuitive cancel parameters', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            const cancelledByField = guestProps.find(
                prop => prop.name === 'cancelledBy'
            );
            expect(cancelledByField?.displayName).toBe('Cancelled By');
            expect(cancelledByField?.required).toBe(true);
            expect(cancelledByField?.options).toBeDefined();
        });
    });

    describe('Guest Reject UX', () => {
        it('should have clear reject operation labeling', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            const operationField = guestProps.find(
                prop => prop.name === 'operation'
            );
            const rejectOption = operationField?.options?.find(
                (opt: any) => opt.value === 'reject'
            );

            expect(rejectOption?.name).toBe('Reject');
            expect((rejectOption as any)?.description).toBeDefined();
        });

        it('should have clear rejection reason field', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            const rejectionReasonField = guestProps.find(
                prop => prop.name === 'rejectionReason'
            );
            expect(rejectionReasonField?.displayName).toBe('Rejection Reason');
            expect(rejectionReasonField?.required).toBe(true);
            expect(rejectionReasonField?.type).toBe('string');
        });
    });

    describe('Guest Check-In UX', () => {
        it('should have clear check-in operation labeling', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            const operationField = guestProps.find(
                prop => prop.name === 'operation'
            );
            const checkInOption = operationField?.options?.find(
                (opt: any) => opt.value === 'checkIn'
            );

            expect(checkInOption?.name).toBe('Check In');
            expect((checkInOption as any)?.description).toContain('Check in');
            expect((checkInOption as any)?.action).toContain('Check in');
        });

        it('should have user-friendly check-in method selector', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            const checkInMethodField = guestProps.find(
                prop => prop.name === 'checkInMethod'
            );
            expect(checkInMethodField?.displayName).toBe('Check-In Method');
            expect(checkInMethodField?.type).toBe('options');
            expect(checkInMethodField?.required).toBe(true);

            const options = checkInMethodField?.options;
            expect(options?.length).toBe(2);

            const guestIdOption = options?.find(
                (opt: any) => opt.value === 'guestId'
            );
            expect(guestIdOption?.name).toBe('Guest ID');
            expect(guestIdOption?.description).toContain('guest ID');

            const emailLookupOption = options?.find(
                (opt: any) => opt.value === 'emailLookup'
            );
            expect(emailLookupOption?.name).toBe('Email Lookup');
            expect(emailLookupOption?.description).toContain('email');
        });

        it('should have conditional parameter display for check-in methods', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            // Check that guest ID field is hidden for email lookup
            const guestIdField = guestProps.find(
                prop => prop.name === 'guestId'
            );
            expect(guestIdField?.displayOptions?.hide?.checkInMethod).toContain(
                'emailLookup'
            );

            // Check that event ID field only shows for email lookup
            const eventIdField = guestProps.find(
                prop =>
                    prop.name === 'eventId' &&
                    prop.displayOptions?.show?.operation?.includes('checkIn')
            );
            expect(eventIdField?.displayOptions?.show?.checkInMethod).toContain(
                'emailLookup'
            );

            // Check that email field only shows for email lookup
            const emailField = guestProps.find(
                prop =>
                    prop.name === 'email' &&
                    prop.displayOptions?.show?.operation?.includes('checkIn')
            );
            expect(emailField?.displayOptions?.show?.checkInMethod).toContain(
                'emailLookup'
            );
        });

        it('should have helpful additional fields for check-in', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            const additionalFields = guestProps.find(
                prop =>
                    prop.name === 'additionalFields' &&
                    prop.displayOptions?.show?.operation?.includes('checkIn')
            );
            expect(additionalFields?.displayName).toBe('Additional Fields');
            expect(additionalFields?.type).toBe('collection');

            const options = additionalFields?.options;
            expect(options?.length).toBe(4);

            // Verify field names and types
            const checkInTimeField = options?.find(
                (opt: any) => opt.name === 'checkInTime'
            );
            expect(checkInTimeField?.displayName).toBe('Check-In Time');
            expect(checkInTimeField?.type).toBe('string');

            const locationField = options?.find(
                (opt: any) => opt.name === 'checkInLocation'
            );
            expect(locationField?.displayName).toBe('Check-In Location');
            expect(locationField?.type).toBe('string');

            const notesField = options?.find(
                (opt: any) => opt.name === 'notes'
            );
            expect(notesField?.displayName).toBe('Notes');
            expect(notesField?.type).toBe('string');

            const verifiedField = options?.find(
                (opt: any) => opt.name === 'verifiedIdentity'
            );
            expect(verifiedField?.displayName).toBe('Verified Identity');
            expect(verifiedField?.type).toBe('boolean');
        });
    });

    describe('Guest Display Options', () => {
        it('should have proper conditional display logic', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            // Test display options for guest-specific fields
            const guestSpecificProps = guestProps.filter(prop =>
                prop.displayOptions?.show?.resource?.includes('guest')
            );

            expect(guestSpecificProps.length).toBeGreaterThan(0);
        });

        it('should have operation-specific parameter visibility', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            // Check that cancel-specific fields only show for cancel operation
            const cancelSpecificProps = guestProps.filter(prop =>
                prop.displayOptions?.show?.operation?.includes('cancel')
            );
            expect(cancelSpecificProps.length).toBeGreaterThan(0);

            // Check that reject-specific fields only show for reject operation
            const rejectSpecificProps = guestProps.filter(prop =>
                prop.displayOptions?.show?.operation?.includes('reject')
            );
            expect(rejectSpecificProps.length).toBeGreaterThan(0);
        });
    });
});
