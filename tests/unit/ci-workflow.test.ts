import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import { parse } from 'yaml';

describe('CI Workflow Tests', () => {
    describe('Basic CI Workflow Setup', () => {
        it('should have ci.yml workflow file', () => {
            expect(fs.existsSync('.github/workflows/ci.yml')).toBe(true);
        });

        it('should have valid YAML syntax', () => {
            const content = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
            expect(() => parse(content)).not.toThrow();
        });

        it('should have correct workflow name', () => {
            const content = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
            const workflow = parse(content);
            expect(workflow.name).toBe('CI');
        });

        it('should trigger on pull requests to any branch', () => {
            const content = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
            const workflow = parse(content);
            expect(workflow.on.pull_request.branches).toEqual(['*']);
        });

        it('should trigger on pushes to main branch', () => {
            const content = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
            const workflow = parse(content);
            expect(workflow.on.push.branches).toEqual(['main']);
        });

        it('should use ubuntu-latest runner', () => {
            const content = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
            const workflow = parse(content);
            expect(workflow.jobs.test['runs-on']).toBe('ubuntu-latest');
        });

        it('should include Node.js 22 setup', () => {
            const content = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
            const workflow = parse(content);
            const nodeStep = workflow.jobs.test.steps.find(
                (step: any) => step.name === 'Setup Node.js'
            );
            expect(nodeStep).toBeDefined();
            expect(nodeStep.uses).toBe('actions/setup-node@v4');
            expect(nodeStep.with['node-version']).toBe('22');
        });

        it('should include pnpm setup', () => {
            const content = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
            const workflow = parse(content);
            const pnpmStep = workflow.jobs.test.steps.find(
                (step: any) => step.name === 'Setup pnpm'
            );
            expect(pnpmStep).toBeDefined();
            expect(pnpmStep.uses).toBe('pnpm/action-setup@v2');
            expect(pnpmStep.with.version).toBe('latest');
        });

        it('should include dependency caching', () => {
            const content = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
            const workflow = parse(content);
            const cacheStep = workflow.jobs.test.steps.find(
                (step: any) => step.name === 'Cache dependencies'
            );
            expect(cacheStep).toBeDefined();
            expect(cacheStep.uses).toBe('actions/cache@v3');
            expect(cacheStep.with.path).toBe('~/.pnpm-store');
            expect(cacheStep.with.key).toContain('${{ runner.os }}-pnpm-');
        });

        it('should include dependency installation step', () => {
            const content = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
            const workflow = parse(content);
            const installStep = workflow.jobs.test.steps.find(
                (step: any) => step.name === 'Install dependencies'
            );
            expect(installStep).toBeDefined();
            expect(installStep.run).toBe('pnpm install');
        });

        it('should be structured for extension', () => {
            const content = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
            expect(content).toContain(
                'Additional steps will be added in subsequent stories'
            );
        });
    });
});
