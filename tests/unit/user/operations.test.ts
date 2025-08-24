import { describe, it, expect } from 'vitest';

describe('User Operations Unit Tests', () => {
    describe('User Constants', () => {
        it('should have user endpoints defined', async () => {
            const { LUMA_ENDPOINTS } = await import(
                '../../../dist/nodes/Luma/shared/constants.js'
            );

            expect(LUMA_ENDPOINTS.USER_GET_SELF).toBeDefined();
            expect(LUMA_ENDPOINTS.USER_GET_SELF).toBe(
                '/public/v1/user/get-self'
            );
        });
    });

    describe('User Interface Compilation', () => {
        it('should have user contracts exported', async () => {
            try {
                await import('../../../dist/nodes/Luma/user/contracts.js');
                expect(true).toBe(true);
            } catch (error) {
                throw new Error('User contracts compilation failed');
            }
        });

        it('should have user operations exported', async () => {
            try {
                await import('../../../dist/nodes/Luma/user/operations.js');
                expect(true).toBe(true);
            } catch (error) {
                throw new Error('User operations compilation failed');
            }
        });
    });

    describe('User Properties Structure', () => {
        it('should have user operation properties', async () => {
            const { userProps } = await import(
                '../../../dist/nodes/Luma/user/props.js'
            );

            expect(Array.isArray(userProps)).toBe(true);
            expect(userProps.length).toBeGreaterThan(0);
        });

        it('should have user operation field', async () => {
            const { userProps } = await import(
                '../../../dist/nodes/Luma/user/props.js'
            );

            const operationField = userProps.find(
                prop => prop.name === 'operation'
            );
            expect(operationField).toBeDefined();
            expect(operationField?.type).toBe('options');
        });
    });
});
