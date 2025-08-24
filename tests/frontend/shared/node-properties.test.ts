import { describe, it, expect } from 'vitest';

describe('Shared Node Properties Frontend Tests', () => {
    describe('Node Property Validation', () => {
        it('should validate that nodes have user-friendly properties', async () => {
            const { Luma } = await import('../../../dist/nodes/Luma/Luma.node.js');
            const { LumaTrigger } = await import('../../../dist/nodes/LumaTrigger/LumaTrigger.node.js');

            const lumaNode = new Luma();
            const triggerNode = new LumaTrigger();

            expect(lumaNode.description.displayName).toBe('Luma');
            expect(triggerNode.description.displayName).toBe('Luma Trigger');

            expect(lumaNode.description.description).toContain('Luma API');
            expect(triggerNode.description.description).toContain('Luma');
        });

        it('should have proper node grouping for n8n UI', async () => {
            const { Luma } = await import('../../../dist/nodes/Luma/Luma.node.js');
            const { LumaTrigger } = await import('../../../dist/nodes/LumaTrigger/LumaTrigger.node.js');

            const lumaNode = new Luma();
            const triggerNode = new LumaTrigger();

            expect(lumaNode.description.group).toContain('output');
            expect(triggerNode.description.group).toContain('trigger');
        });

        it('should have consistent iconography', async () => {
            const { Luma } = await import('../../../dist/nodes/Luma/Luma.node.js');
            const { LumaTrigger } = await import('../../../dist/nodes/LumaTrigger/LumaTrigger.node.js');

            const lumaNode = new Luma();
            const triggerNode = new LumaTrigger();

            expect(lumaNode.description.icon).toBe('file:luma.svg');
            expect(triggerNode.description.icon).toBe('file:luma.svg');
        });
    });

    describe('Parameter Structure', () => {
        it('should have logical parameter hierarchy', async () => {
            const { Luma } = await import('../../../dist/nodes/Luma/Luma.node.js');
            const lumaNode = new Luma();

            const properties = lumaNode.description.properties;
            expect(properties.length).toBeGreaterThan(0);

            // First property should be the resource selector
            expect(properties[0].name).toBe('resource');
            expect(properties[0].type).toBe('options');
        });

        it('should have resource options available', async () => {
            const { Luma } = await import('../../../dist/nodes/Luma/Luma.node.js');
            const lumaNode = new Luma();

            const resourceProperty = lumaNode.description.properties.find(
                (p: any) => p.name === 'resource'
            );
            expect(resourceProperty).toBeDefined();
            expect(resourceProperty?.options).toBeDefined();
            expect(Array.isArray(resourceProperty?.options)).toBe(true);
            expect((resourceProperty?.options as any[]).length).toBeGreaterThan(0);
        });

        it('should have conditional parameter display', async () => {
            const { Luma } = await import('../../../dist/nodes/Luma/Luma.node.js');
            const lumaNode = new Luma();

            const properties = lumaNode.description.properties;

            // Should have properties that show/hide based on selections
            const conditionalProperties = properties.filter(
                (p: any) => p.displayOptions?.show
            );
            expect(conditionalProperties.length).toBeGreaterThan(0);
        });
    });

    describe('Credential Integration UX', () => {
        it('should reference correct credential name', async () => {
            const { Luma } = await import('../../../dist/nodes/Luma/Luma.node.js');
            const lumaNode = new Luma();

            expect(lumaNode.description.credentials).toBeDefined();
            expect(lumaNode.description.credentials).toContainEqual({
                name: 'lumaApi',
                required: true
            });
        });

        it('should have user-friendly credential display', async () => {
            const { LumaApi } = await import('../../../dist/credentials/LumaApi.credentials.js');
            const credential = new LumaApi();

            expect(credential.displayName).toBe('Luma API');
            expect(credential.properties).toBeDefined();
            expect(credential.properties.length).toBeGreaterThan(0);
        });
    });
});
