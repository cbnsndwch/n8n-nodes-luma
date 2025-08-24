import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Build System Tests', () => {
  describe('Source Files', () => {
    it('should have TypeScript source files', () => {
      expect(fs.existsSync('nodes/Luma/Luma.node.ts')).toBe(true);
      expect(fs.existsSync('nodes/LumaTrigger/LumaTrigger.node.ts')).toBe(true);
      expect(fs.existsSync('credentials/LumaApi.credentials.ts')).toBe(true);
    });

    it('should have ticket operations files', () => {
      expect(fs.existsSync('nodes/Luma/ticket/contracts.ts')).toBe(true);
      expect(fs.existsSync('nodes/Luma/ticket/operations.ts')).toBe(true);
      expect(fs.existsSync('nodes/Luma/ticket/props.ts')).toBe(true);
    });

    it('should have built ticket operation files', () => {
      expect(fs.existsSync('dist/nodes/Luma/ticket/contracts.js')).toBe(true);
      expect(fs.existsSync('dist/nodes/Luma/ticket/operations.js')).toBe(true);
      expect(fs.existsSync('dist/nodes/Luma/ticket/props.js')).toBe(true);
    });
  });

  describe('Build Output', () => {
    it('should have dist directory after build', () => {
      expect(fs.existsSync('dist')).toBe(true);
    });

    it('should have compiled JavaScript files', () => {
      expect(fs.existsSync('dist/nodes/Luma/Luma.node.js')).toBe(true);
      expect(fs.existsSync('dist/nodes/LumaTrigger/LumaTrigger.node.js')).toBe(true);
      expect(fs.existsSync('dist/credentials/LumaApi.credentials.js')).toBe(true);
    });

    it('should have TypeScript declaration files', () => {
      expect(fs.existsSync('dist/nodes/Luma/Luma.node.d.ts')).toBe(true);
      expect(fs.existsSync('dist/nodes/LumaTrigger/LumaTrigger.node.d.ts')).toBe(true);
      expect(fs.existsSync('dist/credentials/LumaApi.credentials.d.ts')).toBe(true);
    });

    it('should have copied SVG icons', () => {
      expect(fs.existsSync('dist/nodes/Luma/luma.svg')).toBe(true);
      expect(fs.existsSync('dist/nodes/LumaTrigger/luma.svg')).toBe(true);
    });

    it('should have valid JavaScript syntax in built files', () => {
      const lumaNodePath = 'dist/nodes/Luma/Luma.node.js';
      const content = fs.readFileSync(lumaNodePath, 'utf-8');
      
      // Should not contain TypeScript syntax
      expect(content).not.toContain(': INodeType');
      expect(content).not.toContain('import type');
      
      // Should contain valid JavaScript
      expect(content).toContain('class Luma');
      expect(content).toContain('exports.Luma');
    });
  });

  describe('Test Infrastructure', () => {
    it('should have vitest configuration', () => {
      expect(fs.existsSync('vitest.config.ts')).toBe(true);
    });

    it('should have test directory structure', () => {
      expect(fs.existsSync('tests')).toBe(true);
      expect(fs.existsSync('tests/unit')).toBe(true);
      expect(fs.existsSync('tests/integration')).toBe(true);
      expect(fs.existsSync('tests/frontend')).toBe(true);
    });

    it('should have test setup file', () => {
      expect(fs.existsSync('tests/setup.ts')).toBe(true);
    });

    it('should have package.json test scripts', () => {
      const packagePath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      
      expect(packageJson.scripts.test).toBeDefined();
      expect(packageJson.scripts['test:run']).toBeDefined();
      expect(packageJson.scripts['test:coverage']).toBeDefined();
      expect(packageJson.scripts['test:unit']).toBeDefined();
      expect(packageJson.scripts['test:integration']).toBeDefined();
      expect(packageJson.scripts['test:frontend']).toBeDefined();
    });
  });

  describe('Dependencies', () => {
    it('should have vitest as dev dependency', () => {
      const packagePath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      
      expect(packageJson.devDependencies.vitest).toBeDefined();
      expect(packageJson.devDependencies['@vitest/ui']).toBeDefined();
    });

    it('should maintain existing build dependencies', () => {
      const packagePath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      
      expect(packageJson.devDependencies.typescript).toBeDefined();
      expect(packageJson.devDependencies.gulp).toBeDefined();
      expect(packageJson.devDependencies.eslint).toBeDefined();
      expect(packageJson.devDependencies.prettier).toBeDefined();
    });
  });

  describe('File Structure Integrity', () => {
    it('should preserve existing development workflow', () => {
      const packagePath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      
      // Original scripts should still exist
      expect(packageJson.scripts.build).toContain('tsc');
      expect(packageJson.scripts.dev).toBe('tsc --watch');
      expect(packageJson.scripts.lint).toBeDefined();
      expect(packageJson.scripts.format).toBeDefined();
    });

    it('should not interfere with n8n local testing setup', () => {
      expect(fs.existsSync('.n8n')).toBe(true);
      
      const packagePath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      
      expect(packageJson.scripts['n8n:setup']).toBeDefined();
      expect(packageJson.scripts['n8n:start']).toBeDefined();
      expect(packageJson.scripts['n8n']).toBeDefined();
    });

    it('should have clean gitignore for test artifacts', () => {
      // Tests should be included in git, but coverage reports should be ignored
      const gitignorePath = path.join(process.cwd(), '.gitignore');
      
      if (fs.existsSync(gitignorePath)) {
        const gitignore = fs.readFileSync(gitignorePath, 'utf-8');
        // Should not ignore tests directory
        expect(gitignore).not.toContain('tests/');
      }
    });
  });
});