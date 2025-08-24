import { describe, it, expect } from 'vitest';

describe('Event Operations Unit Tests', () => {
    describe('Event Constants', () => {
        it('should have event endpoints defined', async () => {
            const { LUMA_ENDPOINTS } = await import(
                '../../../dist/nodes/Luma/shared/constants.js'
            );

            expect(LUMA_ENDPOINTS.EVENT_GET).toBeDefined();
            expect(LUMA_ENDPOINTS.EVENT_CREATE).toBeDefined();
            expect(LUMA_ENDPOINTS.EVENT_UPDATE).toBeDefined();
            expect(LUMA_ENDPOINTS.EVENT_DELETE).toBeDefined();
        });
    });

    describe('Event Interface Compilation', () => {
        it('should have event contracts exported', async () => {
            try {
                await import('../../../dist/nodes/Luma/event/contracts.js');
                expect(true).toBe(true);
            } catch (error) {
                throw new Error('Event contracts compilation failed');
            }
        });

        it('should have event operations exported', async () => {
            try {
                await import('../../../dist/nodes/Luma/event/operations.js');
                expect(true).toBe(true);
            } catch (error) {
                throw new Error('Event operations compilation failed');
            }
        });
    });

    describe('Event Properties Structure', () => {
        it('should have event operation properties', async () => {
            const { eventProps } = await import(
                '../../../dist/nodes/Luma/event/props.js'
            );

            expect(Array.isArray(eventProps)).toBe(true);
            expect(eventProps.length).toBeGreaterThan(0);
        });

        it('should have event operation field', async () => {
            const { eventProps } = await import(
                '../../../dist/nodes/Luma/event/props.js'
            );

            const operationField = eventProps.find(
                prop => prop.name === 'operation'
            );
            expect(operationField).toBeDefined();
            expect(operationField?.type).toBe('options');
            expect(operationField?.options).toBeDefined();
        });

        it('should have event-specific display options', async () => {
            const { eventProps } = await import(
                '../../../dist/nodes/Luma/event/props.js'
            );

            const eventSpecificProps = eventProps.filter(prop =>
                prop.displayOptions?.show?.resource?.includes('event')
            );

            expect(eventSpecificProps.length).toBeGreaterThan(0);
        });
    });

    describe('Update Coupon Operation', () => {
        it('should have updateCoupon operation available', async () => {
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

        it('should have couponId field for updateCoupon operation', async () => {
            const { eventProps } = await import(
                '../../../dist/nodes/Luma/event/props.js'
            );

            const couponIdField = eventProps.find(
                prop => prop.name === 'couponId'
            );

            expect(couponIdField).toBeDefined();
            expect(couponIdField?.required).toBe(true);
            expect(couponIdField?.displayOptions?.show?.operation).toContain(
                'updateCoupon'
            );
        });

        it('should have updateFields collection for partial updates', async () => {
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
            expect(updateFieldsCollection?.type).toBe('collection');
            expect(updateFieldsCollection?.options).toBeDefined();
            expect(updateFieldsCollection?.options?.length).toBeGreaterThan(0);
        });

        it('should have required update field options', async () => {
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

            expect(fieldNames).toContain('name');
            expect(fieldNames).toContain('description');
            expect(fieldNames).toContain('maxUses');
            expect(fieldNames).toContain('expiresAt');
            expect(fieldNames).toContain('isActive');
            expect(fieldNames).toContain('isPublic');
        });
    });

    describe('Update Coupon Constants', () => {
        it('should have EVENT_UPDATE_COUPON endpoint defined', async () => {
            const { LUMA_ENDPOINTS } = await import(
                '../../../dist/nodes/Luma/shared/constants.js'
            );

            expect(LUMA_ENDPOINTS.EVENT_UPDATE_COUPON).toBeDefined();
            expect(LUMA_ENDPOINTS.EVENT_UPDATE_COUPON).toBe(
                '/public/v1/event/update-coupon'
            );
        });
    });
});
