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

    it('should have package.json with required fields', () => {
      const packagePath = path.join(process.cwd(), 'package.json');
      expect(fs.existsSync(packagePath)).toBe(true);
      
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      expect(packageJson.name).toBe('@cbnsndwch/n8n-nodes-luma');
      expect(packageJson.n8n).toBeDefined();
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

  describe('GitHub Workflows', () => {
    it('should have workflows directory', () => {
      expect(fs.existsSync('.github')).toBe(true);
      expect(fs.existsSync('.github/workflows')).toBe(true);
    });

    it('should have test workflow file', () => {
      const workflowPath = path.join(process.cwd(), '.github/workflows/test.yml');
      expect(fs.existsSync(workflowPath)).toBe(true);
    });

    it('should have valid workflow configuration', () => {
      const workflowPath = path.join(process.cwd(), '.github/workflows/test.yml');
      const workflowContent = fs.readFileSync(workflowPath, 'utf-8');
      
      // Should trigger on pull requests and main branch pushes
      expect(workflowContent).toContain('pull_request:');
      expect(workflowContent).toContain('push:');
      expect(workflowContent).toContain('branches: [ main ]');
      
      // Should use Node.js 22 as specified in package.json
      expect(workflowContent).toContain('node-version: [22.x]');
      
      // Should use pnpm
      expect(workflowContent).toContain('pnpm/action-setup');
      
      // Should run the required build and test steps
      expect(workflowContent).toContain('pnpm run build');
      expect(workflowContent).toContain('pnpm run lint');
      expect(workflowContent).toContain('pnpm run test:run');
      expect(workflowContent).toContain('prettier nodes credentials --check');
    });

    it('should use same pnpm version as package manager specification', () => {
      const packagePath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      const packageManagerSpec = packageJson.packageManager;
      
      if (packageManagerSpec && packageManagerSpec.startsWith('pnpm@')) {
        const pnpmVersion = packageManagerSpec.split('@')[1].split('+')[0];
        
        const workflowPath = path.join(process.cwd(), '.github/workflows/test.yml');
        const workflowContent = fs.readFileSync(workflowPath, 'utf-8');
        
        expect(workflowContent).toContain(`version: ${pnpmVersion}`);
      }
    });
  });
});