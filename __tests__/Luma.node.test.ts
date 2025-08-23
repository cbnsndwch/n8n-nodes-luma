import { Luma } from '../nodes/Luma/Luma.node';

describe('Luma Node', () => {
  test('should be instantiated', () => {
    const lumaNode = new Luma();
    expect(lumaNode).toBeDefined();
    expect(lumaNode.description.displayName).toBe('Luma');
  });

  test('should have correct node properties', () => {
    const lumaNode = new Luma();
    expect(lumaNode.description.name).toBe('luma');
    expect(lumaNode.description.group).toContain('input');
    expect(lumaNode.description.version).toBe(1);
  });
});