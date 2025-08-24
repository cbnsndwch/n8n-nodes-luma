import { describe, it, expect } from 'vitest';

describe('Node Registration Tests', () => {
  describe('Package Configuration', () => {
    it('should have correct package.json n8n configuration', async () => {
      // Import package.json directly to test configuration
      const packageJson = await import('../../package.json');
      
      expect(packageJson.n8n).toBeDefined();
      expect(packageJson.n8n.n8nNodesApiVersion).toBe(1);
      expect(packageJson.n8n.credentials).toHaveLength(1);
      expect(packageJson.n8n.nodes).toHaveLength(2);
      
      // Check credential paths
      expect(packageJson.n8n.credentials[0]).toBe('dist/credentials/LumaApi.credentials.js');
      
      // Check node paths
      expect(packageJson.n8n.nodes).toContain('dist/nodes/Luma/Luma.node.js');
      expect(packageJson.n8n.nodes).toContain('dist/nodes/LumaTrigger/LumaTrigger.node.js');
    });

    it('should have correct main entry point', async () => {
      const packageJson = await import('../../package.json');
      expect(packageJson.main).toBe('dist/index.js');
    });

    it('should include dist in files array', async () => {
      const packageJson = await import('../../package.json');
      expect(packageJson.files).toContain('dist');
    });
  });

  describe('Build Output Structure', () => {
    it('should have built credential files', async () => {
      // Check if credential files exist after build
      try {
        await import('../../dist/credentials/LumaApi.credentials.js');
        expect(true).toBe(true); // File exists
      } catch (error) {
        throw new Error('LumaApi credentials file not built correctly');
      }
    });

    it('should have built node files', async () => {
      // Check if node files exist after build
      try {
        await import('../../dist/nodes/Luma/Luma.node.js');
        await import('../../dist/nodes/LumaTrigger/LumaTrigger.node.js');
        expect(true).toBe(true); // Files exist
      } catch (error) {
        throw new Error('Node files not built correctly');
      }
    });

    it('should have package.json in dist', async () => {
      try {
        await import('../../dist/package.json');
        expect(true).toBe(true); // File exists
      } catch (error) {
        throw new Error('dist/package.json not found');
      }
    });
  });

  describe('Node Structure Validation', () => {
    it('should export valid credential class', async () => {
      const { LumaApi } = await import('../../dist/credentials/LumaApi.credentials.js');
      
      const credential = new LumaApi();
      expect(credential.name).toBe('lumaApi');
      expect(credential.displayName).toBe('Luma API');
      expect(credential.properties).toBeDefined();
      expect(credential.authenticate).toBeDefined();
      expect(credential.test).toBeDefined();
    });

    it('should export valid Luma node class', async () => {
      const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
      
      const node = new Luma();
      expect(node.description.name).toBe('luma');
      expect(node.description.displayName).toBe('Luma');
      expect(node.description.properties).toBeDefined();
      expect(typeof node.execute).toBe('function');
    });

    it('should export valid LumaTrigger node class', async () => {
      const { LumaTrigger } = await import('../../dist/nodes/LumaTrigger/LumaTrigger.node.js');
      
      const node = new LumaTrigger();
      expect(node.description.name).toBe('lumaTrigger');
      expect(node.description.displayName).toBe('Luma Trigger');
      expect(node.description.properties).toBeDefined();
      expect(node.description.polling).toBe(true);
    });
  });

  describe('Integration with n8n', () => {
    it('should have correct node type interfaces', async () => {
      const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
      const { LumaTrigger } = await import('../../dist/nodes/LumaTrigger/LumaTrigger.node.js');
      
      const lumaNode = new Luma();
      const triggerNode = new LumaTrigger();
      
      // Check INodeType interface compliance
      expect(lumaNode.description).toBeDefined();
      expect(typeof lumaNode.execute).toBe('function');
      
      expect(triggerNode.description).toBeDefined();
      // Trigger nodes have polling enabled rather than explicit poll method
      expect(triggerNode.description.polling).toBe(true);
    });

    it('should have valid credential requirements', async () => {
      const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
      const { LumaTrigger } = await import('../../dist/nodes/LumaTrigger/LumaTrigger.node.js');
      
      const lumaNode = new Luma();
      const triggerNode = new LumaTrigger();
      
      expect(lumaNode.description.credentials).toEqual([{ name: 'lumaApi', required: true }]);
      expect(triggerNode.description.credentials).toEqual([{ name: 'lumaApi', required: true }]);
    });

    it('should have proper input/output configuration', async () => {
      const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
      const { LumaTrigger } = await import('../../dist/nodes/LumaTrigger/LumaTrigger.node.js');
      
      const lumaNode = new Luma();
      const triggerNode = new LumaTrigger();
      
      // Luma node should have input and output
      expect(lumaNode.description.inputs).toEqual(['main']);
      expect(lumaNode.description.outputs).toEqual(['main']);
      
      // Trigger node should have no inputs, only output
      expect(triggerNode.description.inputs).toEqual([]);
      expect(triggerNode.description.outputs).toEqual(['main']);
    });
  });

  describe('Ticket Operation Registration', () => {
    it('should register ticket create operation in resource handlers', async () => {
      const { RESOURCE_HANDLERS } = await import('../../dist/nodes/Luma/operations.js');
      
      expect(RESOURCE_HANDLERS).toBeDefined();
      expect(RESOURCE_HANDLERS.ticket).toBeDefined();
      expect(typeof RESOURCE_HANDLERS.ticket).toBe('function');
    });

    it('should have ticket resource in main node properties', async () => {
      const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
      const lumaNode = new Luma();
      
      const resourceProperty = lumaNode.description.properties.find((p: any) => p.name === 'resource');
      expect(resourceProperty).toBeDefined();
      
      const ticketResource = resourceProperty?.options?.find((opt: any) => opt.value === 'ticket');
      expect(ticketResource).toBeDefined();
      expect(ticketResource?.name).toBe('Ticket');
    });

    it('should have ticket operations properly configured', async () => {
      const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
      const lumaNode = new Luma();
      
      const operationProperty = lumaNode.description.properties.find((p: any) => 
        p.name === 'operation' && 
        p.displayOptions?.show?.resource?.includes('ticket')
      );
      
      expect(operationProperty).toBeDefined();
      expect(operationProperty?.options).toBeDefined();
      
      const operations = operationProperty?.options?.map((opt: any) => opt.value) || [];
      expect(operations).toContain('create');
      expect(operations).toContain('get');
      expect(operations).toContain('list');
    });

    it('should have ticket create operation as default', async () => {
      const { Luma } = await import('../../dist/nodes/Luma/Luma.node.js');
      const lumaNode = new Luma();
      
      const operationProperty = lumaNode.description.properties.find((p: any) => 
        p.name === 'operation' && 
        p.displayOptions?.show?.resource?.includes('ticket')
      );
      
      expect(operationProperty?.default).toBe('create');
    });

    it('should validate ticket operation contracts', async () => {
      // Test that the contracts module exports the expected types
      const contracts = await import('../../dist/nodes/Luma/ticket/contracts.js');
      
      // The module should be defined (TypeScript interfaces are compiled away but exports exist)
      expect(contracts).toBeDefined();
      expect(typeof contracts).toBe('object');
    });
  });
});