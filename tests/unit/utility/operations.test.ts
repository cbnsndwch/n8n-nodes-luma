import { describe, it, expect } from 'vitest';

describe('Utility Operations Unit Tests', () => {
    describe('Utility Constants', () => {
        it('should have utility endpoints defined', async () => {
            const { LUMA_ENDPOINTS } = await import(
                '../../../dist/nodes/Luma/shared/constants.js'
            );

            expect(LUMA_ENDPOINTS.IMAGE_CREATE_UPLOAD_URL).toBeDefined();
            expect(LUMA_ENDPOINTS.IMAGE_CREATE_UPLOAD_URL).toBe('/public/v1/images/create-upload-url');
        });
    });

    describe('Utility Interface Compilation', () => {
        it('should have utility contracts exported', async () => {
            try {
                await import('../../../dist/nodes/Luma/utility/contracts.js');
                expect(true).toBe(true);
            } catch (error) {
                throw new Error('Utility contracts compilation failed');
            }
        });

        it('should have utility operations exported', async () => {
            try {
                await import('../../../dist/nodes/Luma/utility/operations.js');
                expect(true).toBe(true);
            } catch (error) {
                throw new Error('Utility operations compilation failed');
            }
        });
    });

    describe('Utility Properties Structure', () => {
        it('should have utility operation properties', async () => {
            const { utilityProps } = await import(
                '../../../dist/nodes/Luma/utility/props.js'
            );

            expect(Array.isArray(utilityProps)).toBe(true);
            expect(utilityProps.length).toBeGreaterThan(0);
        });

        it('should have utility operation field', async () => {
            const { utilityProps } = await import(
                '../../../dist/nodes/Luma/utility/props.js'
            );

            const operationField = utilityProps.find(
                prop => prop.name === 'operation'
            );
            expect(operationField).toBeDefined();
            expect(operationField?.type).toBe('options');
        });
    });
});
