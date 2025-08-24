import { describe, it, expect } from 'vitest';

describe('Guest Frontend User Experience', () => {
    describe('Guest Parameter Structure', () => {
        it('should have user-friendly guest properties', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            expect(Array.isArray(guestProps)).toBe(true);
            expect(guestProps.length).toBeGreaterThan(0);
            
            const operationProp = guestProps.find(prop => prop.name === 'operation');
            expect(operationProp).toBeDefined();
            expect(operationProp?.options).toBeDefined();
        });

        it('should have clear operation labeling', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            const operationField = guestProps.find(prop => prop.name === 'operation');
            expect(operationField?.displayName).toBe('Operation');
            expect(operationField?.type).toBe('options');
        });
    });

    describe('Guest Cancel UX', () => {
        it('should have clear cancel operation labeling', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            const operationField = guestProps.find(prop => prop.name === 'operation');
            const cancelOption = operationField?.options?.find((opt: any) => opt.value === 'cancel');
            
            expect(cancelOption?.name).toBe('Cancel');
            expect((cancelOption as any)?.description).toContain('Cancel');
            expect((cancelOption as any)?.action).toContain('Cancel');
        });

        it('should have intuitive cancel parameters', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            const cancelledByField = guestProps.find(prop => prop.name === 'cancelledBy');
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

            const operationField = guestProps.find(prop => prop.name === 'operation');
            const rejectOption = operationField?.options?.find((opt: any) => opt.value === 'reject');
            
            expect(rejectOption?.name).toBe('Reject');
            expect((rejectOption as any)?.description).toBeDefined();
        });

        it('should have clear rejection reason field', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            const rejectionReasonField = guestProps.find(prop => prop.name === 'rejectionReason');
            expect(rejectionReasonField?.displayName).toBe('Rejection Reason');
            expect(rejectionReasonField?.required).toBe(true);
            expect(rejectionReasonField?.type).toBe('string');
        });
    });

    describe('Guest Display Options', () => {
        it('should have proper conditional display logic', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            // Test display options for guest-specific fields
            const guestSpecificProps = guestProps.filter(
                prop => prop.displayOptions?.show?.resource?.includes('guest')
            );
            
            expect(guestSpecificProps.length).toBeGreaterThan(0);
        });

        it('should have operation-specific parameter visibility', async () => {
            const { guestProps } = await import(
                '../../../dist/nodes/Luma/guest/props.js'
            );

            // Check that cancel-specific fields only show for cancel operation
            const cancelSpecificProps = guestProps.filter(
                prop => prop.displayOptions?.show?.operation?.includes('cancel')
            );
            expect(cancelSpecificProps.length).toBeGreaterThan(0);

            // Check that reject-specific fields only show for reject operation
            const rejectSpecificProps = guestProps.filter(
                prop => prop.displayOptions?.show?.operation?.includes('reject')
            );
            expect(rejectSpecificProps.length).toBeGreaterThan(0);
        });
    });
});
