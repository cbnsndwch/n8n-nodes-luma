import { describe, it, expect } from 'vitest';

describe('Frontend User Experience', () => {
  describe('Node Property Validation', () => {
    it('should validate that nodes have user-friendly properties', async () => {
      // Test that built nodes have the expected structure for good UX
      const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
      const { LumaTrigger } = await import('../../dist/nodes/LumaTrigger/LumaTrigger.node.js');
      
      const lumaNode = new Luma();
      const triggerNode = new LumaTrigger();
      
      // Nodes should have clear display names
      expect(lumaNode.description.displayName).toBe('Luma');
      expect(triggerNode.description.displayName).toBe('Luma Trigger');
      
      // Should have descriptions for users
      expect(lumaNode.description.description).toContain('Luma API');
      expect(triggerNode.description.description).toContain('Luma');
    });

    it('should have proper node grouping for n8n UI', async () => {
      const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
      const { LumaTrigger } = await import('../../dist/nodes/LumaTrigger/LumaTrigger.node.js');
      
      const lumaNode = new Luma();
      const triggerNode = new LumaTrigger();
      
      // Nodes should be in appropriate groups
      expect(lumaNode.description.group).toContain('output');
      expect(triggerNode.description.group).toContain('trigger');
    });

    it('should have consistent iconography', async () => {
      const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
      const { LumaTrigger } = await import('../../dist/nodes/LumaTrigger/LumaTrigger.node.js');
      
      const lumaNode = new Luma();
      const triggerNode = new LumaTrigger();
      
      // Both nodes should use the same icon for brand consistency
      expect(lumaNode.description.icon).toBe('file:luma.svg');
      expect(triggerNode.description.icon).toBe('file:luma.svg');
    });
  });

  describe('Parameter Structure', () => {
    it('should have logical parameter hierarchy', async () => {
      const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
      const lumaNode = new Luma();
      
      const properties = lumaNode.description.properties;
      expect(properties.length).toBeGreaterThan(0);
      
      // First property should be the resource selector
      expect(properties[0].name).toBe('resource');
      expect(properties[0].type).toBe('options');
    });

    it('should have resource options available', async () => {
      const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
      const lumaNode = new Luma();
      
      const resourceProperty = lumaNode.description.properties.find((p: any) => p.name === 'resource');
      expect(resourceProperty).toBeDefined();
      expect(resourceProperty?.options).toBeDefined();
      expect(Array.isArray(resourceProperty?.options)).toBe(true);
      expect((resourceProperty?.options as any[]).length).toBeGreaterThan(0);
    });

    it('should have conditional parameter display', async () => {
      const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
      const lumaNode = new Luma();
      
      const properties = lumaNode.description.properties;
      
      // Should have properties that show/hide based on selections
      const conditionalProperties = properties.filter((p: any) => p.displayOptions?.show);
      expect(conditionalProperties.length).toBeGreaterThan(0);
    });
  });

  describe('Trigger Node UX', () => {
    it('should have event monitoring options', async () => {
      const { LumaTrigger } = await import('../../dist/nodes/LumaTrigger/LumaTrigger.node.js');
      const triggerNode = new LumaTrigger();
      
      const eventsProperty = triggerNode.description.properties.find((p: any) => p.name === 'events');
      expect(eventsProperty).toBeDefined();
      expect(eventsProperty?.type).toBe('multiOptions');
      expect(eventsProperty?.displayName).toBe('Events to Monitor');
    });

    it('should have proper polling configuration', async () => {
      const { LumaTrigger } = await import('../../dist/nodes/LumaTrigger/LumaTrigger.node.js');
      const triggerNode = new LumaTrigger();
      
      expect(triggerNode.description.polling).toBe(true);
      expect(triggerNode.description.inputs).toEqual([]);
      expect(triggerNode.description.outputs).toEqual(['main']);
    });
  });

  describe('Credential Integration UX', () => {
    it('should require credentials with clear naming', async () => {
      const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
      const { LumaTrigger } = await import('../../dist/nodes/LumaTrigger/LumaTrigger.node.js');
      
      const lumaNode = new Luma();
      const triggerNode = new LumaTrigger();
      
      expect(lumaNode.description.credentials).toEqual([{ name: 'lumaApi', required: true }]);
      expect(triggerNode.description.credentials).toEqual([{ name: 'lumaApi', required: true }]);
    });

    it('should have credential with user-friendly configuration', async () => {
      const { LumaApi } = await import('../../dist/credentials/LumaApi.credentials.js');
      const credential = new LumaApi();
      
      expect(credential.displayName).toBe('Luma API');
      expect(credential.documentationUrl).toContain('docs.lu.ma');
      
      // Should have password field for API key
      const apiKeyProperty = credential.properties.find((p: any) => p.name === 'apiKey');
      expect(apiKeyProperty?.typeOptions?.password).toBe(true);
    });
  });

  describe('Workflow Building Experience', () => {
    it('should provide helpful subtitle templates', async () => {
      const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
      const { LumaTrigger } = await import('../../dist/nodes/LumaTrigger/LumaTrigger.node.js');
      
      const lumaNode = new Luma();
      const triggerNode = new LumaTrigger();
      
      // Subtitles should show current configuration
      expect(lumaNode.description.subtitle).toContain('$parameter');
      expect(triggerNode.description.subtitle).toContain('$parameter["events"]');
    });

    it('should have meaningful default values', async () => {
      const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
      const lumaNode = new Luma();
      
      const resourceProperty = lumaNode.description.properties.find((p: any) => p.name === 'resource');
      expect(resourceProperty?.default).toBeDefined();
    });

    it('should prevent data expression errors where appropriate', async () => {
      const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
      const lumaNode = new Luma();
      
      const resourceProperty = lumaNode.description.properties.find((p: any) => p.name === 'resource');
      expect(resourceProperty?.noDataExpression).toBe(true);
    });
  });
});