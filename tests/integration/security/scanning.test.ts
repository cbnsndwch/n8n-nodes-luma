/**
 * Security Scanning Tests
 *
 * Tests to validate the security scanning functionality including:
 * - Security audit scripts
 * - License compliance checking
 * - Security policy configuration
 * - Build integration
 */

import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

describe('Security Scanning Integration Tests', () => {
    const packageJsonPath = path.resolve('package.json');
    const securityPolicyPath = path.resolve('.security-policy.json');
    const releaseWorkflowPath = path.resolve('.github/workflows/release.yml');
    const ciWorkflowPath = path.resolve('.github/workflows/ci.yml');
    const securityDocPath = path.resolve('SECURITY.md');

    describe('Security Configuration Files', () => {
        it('should have security policy configuration file', () => {
            expect(existsSync(securityPolicyPath)).toBe(true);

            const securityPolicy = JSON.parse(
                readFileSync(securityPolicyPath, 'utf-8')
            );

            // Validate required fields
            expect(securityPolicy).toHaveProperty('auditLevel');
            expect(securityPolicy).toHaveProperty('allowedLicenses');
            expect(securityPolicy).toHaveProperty('failOnVulnerabilities');
            expect(securityPolicy).toHaveProperty('failOnLicenseViolations');

            // Validate audit level
            expect(['low', 'moderate', 'high', 'critical']).toContain(
                securityPolicy.auditLevel
            );

            // Validate boolean flags
            expect(typeof securityPolicy.failOnVulnerabilities).toBe('boolean');
            expect(typeof securityPolicy.failOnLicenseViolations).toBe(
                'boolean'
            );

            // Validate allowed licenses array
            expect(Array.isArray(securityPolicy.allowedLicenses)).toBe(true);
            expect(securityPolicy.allowedLicenses.length).toBeGreaterThan(0);
        });

        it('should have security documentation', () => {
            expect(existsSync(securityDocPath)).toBe(true);

            const securityDoc = readFileSync(securityDocPath, 'utf-8');

            // Check for required sections
            expect(securityDoc).toContain('Security Policy');
            expect(securityDoc).toContain('Security Scanning Overview');
            expect(securityDoc).toContain('Security Checks Performed');
            expect(securityDoc).toContain('Available Security Commands');
            expect(securityDoc).toContain('Security Policy Configuration');
        });
    });

    describe('Package.json Security Scripts', () => {
        it('should have security-related scripts defined', () => {
            expect(existsSync(packageJsonPath)).toBe(true);

            const packageJson = JSON.parse(
                readFileSync(packageJsonPath, 'utf-8')
            );
            const scripts = packageJson.scripts;

            // Check for security scripts
            expect(scripts).toHaveProperty('security:audit');
            expect(scripts).toHaveProperty('security:license');
            expect(scripts).toHaveProperty('security:check');
            expect(scripts).toHaveProperty('security:audit:fix');
            expect(scripts).toHaveProperty('prepublish');

            // Validate script content
            expect(scripts['security:audit']).toContain('pnpm audit');
            expect(scripts['security:license']).toContain('license-checker');
            expect(scripts['security:check']).toContain('security:audit');
            expect(scripts['security:check']).toContain('security:license');
        });

        it('should have correct audit level in security scripts', () => {
            const packageJson = JSON.parse(
                readFileSync(packageJsonPath, 'utf-8')
            );
            const securityAuditScript = packageJson.scripts['security:audit'];

            // Should use high audit level
            expect(securityAuditScript).toContain('--audit-level high');
        });

        it('should include n8n license in allowed licenses', () => {
            const packageJson = JSON.parse(
                readFileSync(packageJsonPath, 'utf-8')
            );
            const licenseScript = packageJson.scripts['security:license'];

            // Should allow n8n's custom license
            expect(licenseScript).toContain(
                'Custom: https://user-images.githubusercontent.com'
            );
        });
    });

    describe('Workflow Integration', () => {
        it('should have security scanning in release workflow', () => {
            expect(existsSync(releaseWorkflowPath)).toBe(true);

            const releaseWorkflow = readFileSync(releaseWorkflowPath, 'utf-8');

            // Check for security steps
            expect(releaseWorkflow).toContain('Security Audit');
            expect(releaseWorkflow).toContain('License Compliance Check');
            expect(releaseWorkflow).toContain('Dependency Security Validation');

            // Check for audit command
            expect(releaseWorkflow).toContain('pnpm audit');
            expect(releaseWorkflow).toContain('--audit-level high');

            // Check for license checking
            expect(releaseWorkflow).toContain('license-checker');

            // Check for failure handling
            expect(releaseWorkflow).toContain(
                'Release blocked due to security'
            );
            expect(releaseWorkflow).toContain('::error::');
        });

        it('should have advisory security scanning in CI workflow', () => {
            expect(existsSync(ciWorkflowPath)).toBe(true);

            const ciWorkflow = readFileSync(ciWorkflowPath, 'utf-8');

            // Check for security scanning step
            expect(ciWorkflow).toContain('Security Scan');
            expect(ciWorkflow).toContain('advisory only');

            // Should not fail CI, just report
            expect(ciWorkflow).toContain('|| {');
            expect(ciWorkflow).toContain('will block release');
        });

        it('should run security checks before publishing', () => {
            const releaseWorkflow = readFileSync(releaseWorkflowPath, 'utf-8');

            // Security checks should come before publish step
            const securityIndex = releaseWorkflow.indexOf('Security Audit');
            const publishIndex = releaseWorkflow.indexOf('Publish to npmjs');

            expect(securityIndex).toBeGreaterThan(-1);
            expect(publishIndex).toBeGreaterThan(-1);
            expect(securityIndex).toBeLessThan(publishIndex);
        });
    });

    describe('Security Script Functionality', () => {
        it('should detect when vulnerabilities exist', () => {
            // Since we know there's a critical vulnerability, audit should fail
            expect(() => {
                execSync('pnpm run security:audit', {
                    stdio: 'pipe',
                    cwd: process.cwd()
                });
            }).toThrow();
        });

        it('should pass license compliance check', () => {
            // License check should pass with current configuration
            expect(() => {
                execSync('pnpm run security:license', {
                    stdio: 'pipe',
                    cwd: process.cwd()
                });
            }).not.toThrow();
        });

        it('should validate security check command fails on vulnerabilities', () => {
            // Full security check should fail due to critical vulnerability
            expect(() => {
                execSync('pnpm run security:check', {
                    stdio: 'pipe',
                    cwd: process.cwd()
                });
            }).toThrow();
        });

        it('should have pnpm audit available', () => {
            // Basic audit command should be available
            expect(() => {
                execSync('pnpm audit --help', {
                    stdio: 'pipe',
                    cwd: process.cwd()
                });
            }).not.toThrow();
        });

        it('should have license-checker available via npx', () => {
            // License checker should be available
            expect(() => {
                execSync('npx license-checker --help', {
                    stdio: 'pipe',
                    cwd: process.cwd()
                });
            }).not.toThrow();
        });
    });

    describe('Security Policy Validation', () => {
        it('should have restrictive audit level', () => {
            const securityPolicy = JSON.parse(
                readFileSync(securityPolicyPath, 'utf-8')
            );

            // Should be set to high for production releases
            expect(securityPolicy.auditLevel).toBe('high');
        });

        it('should fail on vulnerabilities and license violations', () => {
            const securityPolicy = JSON.parse(
                readFileSync(securityPolicyPath, 'utf-8')
            );

            expect(securityPolicy.failOnVulnerabilities).toBe(true);
            expect(securityPolicy.failOnLicenseViolations).toBe(true);
        });

        it('should include standard open source licenses', () => {
            const securityPolicy = JSON.parse(
                readFileSync(securityPolicyPath, 'utf-8')
            );
            const allowedLicenses = securityPolicy.allowedLicenses;

            // Common open source licenses should be allowed
            expect(allowedLicenses).toContain('MIT');
            expect(allowedLicenses).toContain('Apache-2.0');
            expect(allowedLicenses).toContain('BSD-3-Clause');
            expect(allowedLicenses).toContain('ISC');
        });

        it('should allow n8n workflow license specifically', () => {
            const securityPolicy = JSON.parse(
                readFileSync(securityPolicyPath, 'utf-8')
            );
            const allowedLicenses = securityPolicy.allowedLicenses;

            // n8n-workflow requires this specific license
            const n8nLicense = allowedLicenses.find(license =>
                license.includes('user-images.githubusercontent.com')
            );
            expect(n8nLicense).toBeDefined();
        });
    });
});
