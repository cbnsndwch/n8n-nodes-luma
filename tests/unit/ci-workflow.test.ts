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

        it('should not contain placeholder text after test integration', () => {
            const content = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
            expect(content).not.toContain(
                'Additional steps will be added in subsequent stories'
            );
        });
    });

    describe('Test Execution Integration', () => {
        it('should include test execution with coverage', () => {
            const content = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
            const workflow = parse(content);
            const testStep = workflow.jobs.test.steps.find(
                (step: any) => step.name === 'Run tests with coverage'
            );
            expect(testStep).toBeDefined();
            expect(testStep.run).toBe('pnpm run test:coverage');
        });

        it('should include coverage upload to Codecov', () => {
            const content = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
            const workflow = parse(content);
            const codecovStep = workflow.jobs.test.steps.find(
                (step: any) => step.name === 'Upload coverage to Codecov'
            );
            expect(codecovStep).toBeDefined();
            expect(codecovStep.uses).toBe('codecov/codecov-action@v3');
            expect(codecovStep.with.token).toBe('${{ secrets.CODECOV_TOKEN }}');
            expect(codecovStep.with.file).toBe('./coverage/lcov.info');
            expect(codecovStep.with.flags).toBe('unittests');
            expect(codecovStep.with.fail_ci_if_error).toBe(true);
        });

        it('should have coverage test execution and upload steps in correct order after dependency installation', () => {
            const content = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
            const workflow = parse(content);
            const steps = workflow.jobs.test.steps;

            const installIndex = steps.findIndex(
                (step: any) => step.name === 'Install dependencies'
            );
            const coverageTestIndex = steps.findIndex(
                (step: any) => step.name === 'Run tests with coverage'
            );
            const codecovUploadIndex = steps.findIndex(
                (step: any) => step.name === 'Upload coverage to Codecov'
            );

            expect(installIndex).toBeGreaterThan(-1);
            expect(coverageTestIndex).toBeGreaterThan(installIndex);
            expect(codecovUploadIndex).toBeGreaterThan(coverageTestIndex);
        });

        it('should have all required test commands available in package.json', () => {
            const packageContent = fs.readFileSync('package.json', 'utf8');
            const packageJson = JSON.parse(packageContent);

            expect(packageJson.scripts).toBeDefined();
            expect(packageJson.scripts.test).toBe('vitest');
            expect(packageJson.scripts['test:unit']).toBe(
                'vitest run tests/unit'
            );
            expect(packageJson.scripts['test:integration']).toBe(
                'vitest run tests/integration'
            );
            expect(packageJson.scripts['test:frontend']).toBe(
                'vitest run tests/frontend'
            );
        });
    });

    describe('Code Quality Checks', () => {
        it('should include development linting step', () => {
            const content = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
            const workflow = parse(content);
            const lintStep = workflow.jobs.test.steps.find(
                (step: any) => step.name === 'Lint code (development rules)'
            );
            expect(lintStep).toBeDefined();
            expect(lintStep.run).toContain('pnpm run lint');
        });

        it('should include format check step', () => {
            const content = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
            const workflow = parse(content);
            const formatStep = workflow.jobs.test.steps.find(
                (step: any) => step.name === 'Format check'
            );
            expect(formatStep).toBeDefined();
            expect(formatStep.run).toContain('prettier');
            expect(formatStep.run).toContain('--check');
        });

        it('should include prepublish linting step', () => {
            const content = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
            const workflow = parse(content);
            const prepublishLintStep = workflow.jobs.test.steps.find(
                (step: any) => step.name === 'Lint code (prepublish rules)'
            );
            expect(prepublishLintStep).toBeDefined();
            expect(prepublishLintStep.run).toContain(
                'eslint -c .eslintrc.prepublish.js'
            );
        });

        it('should have code quality steps after build validation and before tests', () => {
            const content = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
            const workflow = parse(content);
            const steps = workflow.jobs.test.steps;

            const buildValidationIndex = steps.findIndex(
                (step: any) => step.name === 'Validate build artifacts'
            );
            const devLintIndex = steps.findIndex(
                (step: any) => step.name === 'Lint code (development rules)'
            );
            const formatCheckIndex = steps.findIndex(
                (step: any) => step.name === 'Format check'
            );
            const prepublishLintIndex = steps.findIndex(
                (step: any) => step.name === 'Lint code (prepublish rules)'
            );
            const runTestsIndex = steps.findIndex(
                (step: any) => step.name === 'Run tests with coverage'
            );

            // All steps should exist
            expect(buildValidationIndex).toBeGreaterThan(-1);
            expect(devLintIndex).toBeGreaterThan(-1);
            expect(formatCheckIndex).toBeGreaterThan(-1);
            expect(prepublishLintIndex).toBeGreaterThan(-1);
            expect(runTestsIndex).toBeGreaterThan(-1);

            // Code quality steps should be after build validation
            expect(devLintIndex).toBeGreaterThan(buildValidationIndex);
            expect(formatCheckIndex).toBeGreaterThan(buildValidationIndex);
            expect(prepublishLintIndex).toBeGreaterThan(buildValidationIndex);

            // Code quality steps should be before tests
            expect(runTestsIndex).toBeGreaterThan(devLintIndex);
            expect(runTestsIndex).toBeGreaterThan(formatCheckIndex);
            expect(runTestsIndex).toBeGreaterThan(prepublishLintIndex);
        });

        it('should have proper error handling in code quality steps', () => {
            const content = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
            const workflow = parse(content);

            const devLintStep = workflow.jobs.test.steps.find(
                (step: any) => step.name === 'Lint code (development rules)'
            );
            const formatStep = workflow.jobs.test.steps.find(
                (step: any) => step.name === 'Format check'
            );
            const prepublishLintStep = workflow.jobs.test.steps.find(
                (step: any) => step.name === 'Lint code (prepublish rules)'
            );

            // All steps should have error handling with exit 1
            expect(devLintStep.run).toContain('exit 1');
            expect(formatStep.run).toContain('exit 1');
            expect(prepublishLintStep.run).toContain('exit 1');
        });

        it('should have required linting commands available in package.json', () => {
            const packageContent = fs.readFileSync('package.json', 'utf8');
            const packageJson = JSON.parse(packageContent);

            expect(packageJson.scripts).toBeDefined();
            expect(packageJson.scripts.lint).toBe(
                'eslint nodes credentials package.json'
            );
            expect(packageJson.scripts.format).toBe(
                'prettier nodes credentials tests --write'
            );
        });
    });
});
