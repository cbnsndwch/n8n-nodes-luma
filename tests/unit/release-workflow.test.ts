import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import { parse } from 'yaml';

describe('Release Workflow Tests', () => {
    describe('Basic Release Workflow Setup', () => {
        it('should have release.yml workflow file', () => {
            expect(fs.existsSync('.github/workflows/release.yml')).toBe(true);
        });

        it('should have valid YAML syntax', () => {
            const content = fs.readFileSync(
                '.github/workflows/release.yml',
                'utf8'
            );
            expect(() => parse(content)).not.toThrow();
        });

        it('should have correct workflow name', () => {
            const content = fs.readFileSync(
                '.github/workflows/release.yml',
                'utf8'
            );
            const workflow = parse(content);
            expect(workflow.name).toBe('Release to npm');
        });

        it('should trigger only on semantic version tags', () => {
            const content = fs.readFileSync(
                '.github/workflows/release.yml',
                'utf8'
            );
            const workflow = parse(content);
            expect(workflow.on.push.tags).toEqual(['v*.*.*']);
        });

        it('should use ubuntu-latest runner', () => {
            const content = fs.readFileSync(
                '.github/workflows/release.yml',
                'utf8'
            );
            const workflow = parse(content);
            expect(workflow.jobs.publish['runs-on']).toBe('ubuntu-latest');
        });

        it('should include Node.js 22 setup with npm registry', () => {
            const content = fs.readFileSync(
                '.github/workflows/release.yml',
                'utf8'
            );
            const workflow = parse(content);
            const nodeStep = workflow.jobs.publish.steps.find(
                (step: any) => step.name === 'Setup Node.js'
            );
            expect(nodeStep).toBeDefined();
            expect(nodeStep.uses).toBe('actions/setup-node@v4');
            expect(nodeStep.with['node-version']).toBe('22');
            expect(nodeStep.with['registry-url']).toBe(
                'https://registry.npmjs.org'
            );
        });

        it('should include pnpm setup', () => {
            const content = fs.readFileSync(
                '.github/workflows/release.yml',
                'utf8'
            );
            const workflow = parse(content);
            const pnpmStep = workflow.jobs.publish.steps.find(
                (step: any) => step.name === 'Setup pnpm'
            );
            expect(pnpmStep).toBeDefined();
            expect(pnpmStep.uses).toBe('pnpm/action-setup@v4');
            expect(pnpmStep.with.version).toBe('latest');
        });
    });

    describe('Workflow Validation Steps', () => {
        it('should include dependency installation step', () => {
            const content = fs.readFileSync(
                '.github/workflows/release.yml',
                'utf8'
            );
            const workflow = parse(content);
            const installStep = workflow.jobs.publish.steps.find(
                (step: any) => step.name === 'Install dependencies'
            );
            expect(installStep).toBeDefined();
            expect(installStep.run).toContain('pnpm install');
        });

        it('should include package dry-run validation', () => {
            const content = fs.readFileSync(
                '.github/workflows/release.yml',
                'utf8'
            );
            const workflow = parse(content);
            const dryRunStep = workflow.jobs.publish.steps.find(
                (step: any) => step.name === 'Validate package with dry-run'
            );
            expect(dryRunStep).toBeDefined();
            expect(dryRunStep.run).toContain('npm pack --dry-run');
        });

        it('should include comprehensive pre-publish validation', () => {
            const content = fs.readFileSync(
                '.github/workflows/release.yml',
                'utf8'
            );
            const workflow = parse(content);
            const validationStep = workflow.jobs.publish.steps.find(
                (step: any) => step.name === 'Run comprehensive validation'
            );
            expect(validationStep).toBeDefined();
            expect(validationStep.run).toContain('pnpm run prepublishOnly');
        });

        it('should include test execution step', () => {
            const content = fs.readFileSync(
                '.github/workflows/release.yml',
                'utf8'
            );
            const workflow = parse(content);
            const testStep = workflow.jobs.publish.steps.find(
                (step: any) => step.name === 'Run tests'
            );
            expect(testStep).toBeDefined();
            expect(testStep.run).toContain('pnpm run test');
        });

        it('should include package contents validation', () => {
            const content = fs.readFileSync(
                '.github/workflows/release.yml',
                'utf8'
            );
            const workflow = parse(content);
            const contentsStep = workflow.jobs.publish.steps.find(
                (step: any) => step.name === 'Validate package contents'
            );
            expect(contentsStep).toBeDefined();
            expect(contentsStep.run).toContain('test -d dist');
            expect(contentsStep.run).toContain('test -f dist/package.json');
            expect(contentsStep.run).toContain(
                'test -f dist/nodes/Luma/Luma.node.js'
            );
            expect(contentsStep.run).toContain(
                'test -f dist/credentials/LumaApi.credentials.js'
            );
        });
    });

    describe('Publishing and Authentication', () => {
        it('should include npm publish step with correct configuration', () => {
            const content = fs.readFileSync(
                '.github/workflows/release.yml',
                'utf8'
            );
            const workflow = parse(content);
            const publishStep = workflow.jobs.publish.steps.find(
                (step: any) => step.name === 'Publish to npm'
            );
            expect(publishStep).toBeDefined();
            expect(publishStep.run).toContain('pnpm publish --access public');
            expect(publishStep.env).toBeDefined();
            expect(publishStep.env.NODE_AUTH_TOKEN).toBe(
                '${{ secrets.NPM_TOKEN }}'
            );
        });

        it('should include publication verification step', () => {
            const content = fs.readFileSync(
                '.github/workflows/release.yml',
                'utf8'
            );
            const workflow = parse(content);
            const verifyStep = workflow.jobs.publish.steps.find(
                (step: any) => step.name === 'Verify publication'
            );
            expect(verifyStep).toBeDefined();
            expect(verifyStep.run).toContain('npm view');
        });
    });

    describe('Error Handling and Safety', () => {
        it('should have proper error handling in all validation steps', () => {
            const content = fs.readFileSync(
                '.github/workflows/release.yml',
                'utf8'
            );
            const workflow = parse(content);

            const validationSteps = [
                'Install dependencies',
                'Validate package with dry-run',
                'Run comprehensive validation',
                'Run tests',
                'Validate package contents',
                'Publish to npm'
            ];

            validationSteps.forEach(stepName => {
                const step = workflow.jobs.publish.steps.find(
                    (step: any) => step.name === stepName
                );
                expect(step).toBeDefined();
                expect(step.run).toContain('exit 1');
            });
        });

        it('should have descriptive success and failure messages', () => {
            const content = fs.readFileSync(
                '.github/workflows/release.yml',
                'utf8'
            );
            const workflow = parse(content);

            // Check for success messages (✅)
            const stepsWithSuccessMessages = workflow.jobs.publish.steps.filter(
                (step: any) => step.run && step.run.includes('✅')
            );
            expect(stepsWithSuccessMessages.length).toBeGreaterThan(0);

            // Check for error messages (❌)
            const stepsWithErrorMessages = workflow.jobs.publish.steps.filter(
                (step: any) => step.run && step.run.includes('❌')
            );
            expect(stepsWithErrorMessages.length).toBeGreaterThan(0);
        });
    });

    describe('Step Execution Order', () => {
        it('should have validation steps before publishing', () => {
            const content = fs.readFileSync(
                '.github/workflows/release.yml',
                'utf8'
            );
            const workflow = parse(content);
            const steps = workflow.jobs.publish.steps;

            const installIndex = steps.findIndex(
                (step: any) => step.name === 'Install dependencies'
            );
            const dryRunIndex = steps.findIndex(
                (step: any) => step.name === 'Validate package with dry-run'
            );
            const validationIndex = steps.findIndex(
                (step: any) => step.name === 'Run comprehensive validation'
            );
            const testIndex = steps.findIndex(
                (step: any) => step.name === 'Run tests'
            );
            const contentsIndex = steps.findIndex(
                (step: any) => step.name === 'Validate package contents'
            );
            const publishIndex = steps.findIndex(
                (step: any) => step.name === 'Publish to npm'
            );

            // All validation steps should be before publish
            expect(installIndex).toBeGreaterThan(-1);
            expect(dryRunIndex).toBeGreaterThan(installIndex);
            expect(validationIndex).toBeGreaterThan(dryRunIndex);
            expect(testIndex).toBeGreaterThan(validationIndex);
            expect(contentsIndex).toBeGreaterThan(testIndex);
            expect(publishIndex).toBeGreaterThan(contentsIndex);
        });
    });

    describe('Package Configuration Compatibility', () => {
        it('should be compatible with package.json scripts', () => {
            const packageContent = fs.readFileSync('package.json', 'utf8');
            const packageJson = JSON.parse(packageContent);

            // Verify required scripts exist
            expect(packageJson.scripts.prepublishOnly).toBeDefined();
            expect(packageJson.scripts.test).toBeDefined();
            expect(packageJson.scripts.build).toBeDefined();
        });

        it('should be compatible with package files configuration', () => {
            const packageContent = fs.readFileSync('package.json', 'utf8');
            const packageJson = JSON.parse(packageContent);

            // Verify files field points to dist
            expect(packageJson.files).toEqual(['dist']);
        });

        it('should validate npm ignore configuration exists', () => {
            expect(fs.existsSync('.npmignore')).toBe(true);
        });
    });

    describe('npm Authentication Configuration', () => {
        it('should include npm authentication validation step', () => {
            const content = fs.readFileSync(
                '.github/workflows/release.yml',
                'utf8'
            );
            const workflow = parse(content);
            const authStep = workflow.jobs.publish.steps.find(
                (step: any) => step.name === 'Validate npm authentication'
            );
            expect(authStep).toBeDefined();
            expect(authStep.env).toBeDefined();
            expect(authStep.env.NODE_AUTH_TOKEN).toBe(
                '${{ secrets.NPM_TOKEN }}'
            );
        });

        it('should validate NPM_TOKEN secret is available', () => {
            const content = fs.readFileSync(
                '.github/workflows/release.yml',
                'utf8'
            );
            const workflow = parse(content);
            const authStep = workflow.jobs.publish.steps.find(
                (step: any) => step.name === 'Validate npm authentication'
            );
            expect(authStep).toBeDefined();
            expect(authStep.run).toContain('NODE_AUTH_TOKEN');
            expect(authStep.run).toContain('NPM_TOKEN secret is not set');
        });

        it('should test npm whoami for authentication validation', () => {
            const content = fs.readFileSync(
                '.github/workflows/release.yml',
                'utf8'
            );
            const workflow = parse(content);
            const authStep = workflow.jobs.publish.steps.find(
                (step: any) => step.name === 'Validate npm authentication'
            );
            expect(authStep).toBeDefined();
            expect(authStep.run).toContain('npm whoami');
        });

        it('should provide clear error messages for authentication failures', () => {
            const content = fs.readFileSync(
                '.github/workflows/release.yml',
                'utf8'
            );
            const workflow = parse(content);
            const authStep = workflow.jobs.publish.steps.find(
                (step: any) => step.name === 'Validate npm authentication'
            );
            expect(authStep).toBeDefined();
            expect(authStep.run).toContain('npm authentication failed');
            expect(authStep.run).toContain(
                'https://www.npmjs.com/settings/tokens'
            );
            expect(authStep.run).toContain('repository settings');
        });

        it('should validate authentication before publishing', () => {
            const content = fs.readFileSync(
                '.github/workflows/release.yml',
                'utf8'
            );
            const workflow = parse(content);
            const steps = workflow.jobs.publish.steps;

            const authIndex = steps.findIndex(
                (step: any) => step.name === 'Validate npm authentication'
            );
            const publishIndex = steps.findIndex(
                (step: any) => step.name === 'Publish to npm'
            );

            expect(authIndex).toBeGreaterThan(-1);
            expect(publishIndex).toBeGreaterThan(-1);
            expect(authIndex).toBeLessThan(publishIndex);
        });

        it('should have enhanced error messages in publish step', () => {
            const content = fs.readFileSync(
                '.github/workflows/release.yml',
                'utf8'
            );
            const workflow = parse(content);
            const publishStep = workflow.jobs.publish.steps.find(
                (step: any) => step.name === 'Publish to npm'
            );
            expect(publishStep).toBeDefined();
            expect(publishStep.run).toContain('Common causes and solutions');
            expect(publishStep.run).toContain('Authentication failed');
            expect(publishStep.run).toContain('Permission denied');
            expect(publishStep.run).toContain('Version already exists');
        });

        it('should provide troubleshooting commands in publish errors', () => {
            const content = fs.readFileSync(
                '.github/workflows/release.yml',
                'utf8'
            );
            const workflow = parse(content);
            const publishStep = workflow.jobs.publish.steps.find(
                (step: any) => step.name === 'Publish to npm'
            );
            expect(publishStep).toBeDefined();
            expect(publishStep.run).toContain('npm view');
            expect(publishStep.run).toContain('npm whoami');
            expect(publishStep.run).toContain('npm access list packages');
        });
    });
});
