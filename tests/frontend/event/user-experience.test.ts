import { describe, it, expect } from 'vitest';

describe('Event Frontend User Experience', () => {
    describe('Event Parameter Structure', () => {
        it('should have user-friendly event properties', async () => {
            const { eventProps } = await import(
                '../../../dist/nodes/Luma/event/props.js'
            );

            expect(Array.isArray(eventProps)).toBe(true);
            expect(eventProps.length).toBeGreaterThan(0);

            // Check for operation property
            const operationProp = eventProps.find(
                prop => prop.name === 'operation'
            );
            expect(operationProp).toBeDefined();
            expect(operationProp?.displayName).toBeDefined();
        });

        it('should have clear operation labeling for updateCoupon', async () => {
            const { eventProps } = await import(
                '../../../dist/nodes/Luma/event/props.js'
            );

            const operationField = eventProps.find(
                prop => prop.name === 'operation'
            );

            const updateCouponOption = operationField?.options?.find(
                (option: any) => option.value === 'updateCoupon'
            );

            expect(updateCouponOption).toBeDefined();
            expect(updateCouponOption?.name).toBe('Update Coupon');
            expect(updateCouponOption?.action).toBe('Update an event coupon');
        });
    });

    describe('Update Coupon Display Options', () => {
        it('should have proper conditional display logic for couponId', async () => {
            const { eventProps } = await import(
                '../../../dist/nodes/Luma/event/props.js'
            );

            const couponIdField = eventProps.find(
                prop => prop.name === 'couponId'
            );

            expect(couponIdField).toBeDefined();
            expect(couponIdField?.displayOptions?.show?.resource).toContain(
                'event'
            );
            expect(couponIdField?.displayOptions?.show?.operation).toContain(
                'updateCoupon'
            );
        });

        it('should have operation-specific parameter visibility for updateFields', async () => {
            const { eventProps } = await import(
                '../../../dist/nodes/Luma/event/props.js'
            );

            const updateFieldsCollection = eventProps.find(
                prop =>
                    prop.name === 'updateFields' &&
                    prop.displayOptions?.show?.operation?.includes(
                        'updateCoupon'
                    )
            );

            expect(updateFieldsCollection).toBeDefined();
            expect(
                updateFieldsCollection?.displayOptions?.show?.resource
            ).toContain('event');
            expect(
                updateFieldsCollection?.displayOptions?.show?.operation
            ).toContain('updateCoupon');
        });
    });

    describe('Update Coupon User Experience', () => {
        it('should have intuitive field naming and descriptions', async () => {
            const { eventProps } = await import(
                '../../../dist/nodes/Luma/event/props.js'
            );

            const couponIdField = eventProps.find(
                prop => prop.name === 'couponId'
            );

            expect(couponIdField?.displayName).toBe('Coupon ID');
            expect(couponIdField?.description).toContain(
                'API ID of the coupon to update'
            );
            expect(couponIdField?.placeholder).toBe('coupon_123abc...');
        });

        it('should have comprehensive updateFields collection', async () => {
            const { eventProps } = await import(
                '../../../dist/nodes/Luma/event/props.js'
            );

            const updateFieldsCollection = eventProps.find(
                prop =>
                    prop.name === 'updateFields' &&
                    prop.displayOptions?.show?.operation?.includes(
                        'updateCoupon'
                    )
            );

            expect(updateFieldsCollection?.displayName).toBe('Update Fields');
            expect(updateFieldsCollection?.type).toBe('collection');
            expect(updateFieldsCollection?.placeholder).toBe('Add Field');
        });

        it('should have well-structured update field options', async () => {
            const { eventProps } = await import(
                '../../../dist/nodes/Luma/event/props.js'
            );

            const updateFieldsCollection = eventProps.find(
                prop =>
                    prop.name === 'updateFields' &&
                    prop.displayOptions?.show?.operation?.includes(
                        'updateCoupon'
                    )
            );

            const options = updateFieldsCollection?.options;
            expect(options).toBeDefined();
            expect(options?.length).toBeGreaterThan(0);

            // Check specific field options
            const nameField = options?.find((opt: any) => opt.name === 'name');
            expect(nameField?.displayName).toBe('Name');
            expect(nameField?.type).toBe('string');
            expect(nameField?.description).toContain('Updated display name');

            const descriptionField = options?.find(
                (opt: any) => opt.name === 'description'
            );
            expect(descriptionField?.displayName).toBe('Description');
            expect(descriptionField?.type).toBe('string');

            const isActiveField = options?.find(
                (opt: any) => opt.name === 'isActive'
            );
            expect(isActiveField?.displayName).toBe('Is Active');
            expect(isActiveField?.type).toBe('boolean');
        });

        it('should have appropriate field types and defaults', async () => {
            const { eventProps } = await import(
                '../../../dist/nodes/Luma/event/props.js'
            );

            const updateFieldsCollection = eventProps.find(
                prop =>
                    prop.name === 'updateFields' &&
                    prop.displayOptions?.show?.operation?.includes(
                        'updateCoupon'
                    )
            );

            const options = updateFieldsCollection?.options;

            // Check field types
            const maxUsesField = options?.find(
                (opt: any) => opt.name === 'maxUses'
            );
            expect(maxUsesField?.type).toBe('number');
            expect(maxUsesField?.default).toBe(0);

            const expiresAtField = options?.find(
                (opt: any) => opt.name === 'expiresAt'
            );
            expect(expiresAtField?.type).toBe('dateTime');
            expect(expiresAtField?.description).toContain('ISO 8601');

            const isPublicField = options?.find(
                (opt: any) => opt.name === 'isPublic'
            );
            expect(isPublicField?.type).toBe('boolean');
            expect(isPublicField?.default).toBe(true);
        });

        it('should have logical field ordering in collection', async () => {
            const { eventProps } = await import(
                '../../../dist/nodes/Luma/event/props.js'
            );

            const updateFieldsCollection = eventProps.find(
                prop =>
                    prop.name === 'updateFields' &&
                    prop.displayOptions?.show?.operation?.includes(
                        'updateCoupon'
                    )
            );

            const fieldNames = updateFieldsCollection?.options?.map(
                (opt: any) => opt.name
            );

            // Check alphabetical ordering (required by linting rules)
            const expectedOrder = [
                'description',
                'expiresAt',
                'isActive',
                'isPublic',
                'maxUses',
                'name'
            ];
            expect(fieldNames).toEqual(expectedOrder);
        });
    });
});
