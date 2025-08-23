#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { existsSync, readFileSync, statSync } from 'fs';
import { join, resolve } from 'path';

/**
 * Health check script for local n8n testing environment
 * Validates that all components are properly configured
 */

const PROJECT_ROOT = resolve(__dirname, '../..');
const DIST_DIR = join(PROJECT_ROOT, 'dist');
const N8N_LOCAL_ROOT = join(PROJECT_ROOT, '.n8n/.local');
const ENV_FILE = join(N8N_LOCAL_ROOT, '.env');
const CUSTOM_NODES_DIR = join(N8N_LOCAL_ROOT, 'n8n-custom-nodes');

interface HealthCheckOptions {
  verbose?: boolean;
  fix?: boolean;
}

interface CheckResult {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  fixable?: boolean;
}

class HealthChecker {
  private options: HealthCheckOptions;
  private results: CheckResult[] = [];

  constructor(options: HealthCheckOptions = {}) {
    this.options = options;
  }

  /**
   * Log message if verbose mode is enabled
   */
  private log(message: string): void {
    if (this.options.verbose) {
      console.log(`[HEALTH] ${message}`);
    }
  }

  /**
   * Add a check result
   */
  private addResult(result: CheckResult): void {
    this.results.push(result);
    
    const icon = result.status === 'pass' ? '✅' : result.status === 'warn' ? '⚠️' : '❌';
    console.log(`${icon} ${result.name}: ${result.message}`);
    
    if (this.options.verbose && result.status !== 'pass') {
      this.log(`Details: ${result.message}`);
    }
  }

  /**
   * Check Node.js version compatibility
   */
  private checkNodeVersion(): void {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion >= 22) {
      this.addResult({
        name: 'Node.js Version',
        status: 'pass',
        message: `${nodeVersion} (recommended)`
      });
    } else if (majorVersion >= 20) {
      this.addResult({
        name: 'Node.js Version',
        status: 'warn',
        message: `${nodeVersion} (works but >= 22 recommended)`
      });
    } else {
      this.addResult({
        name: 'Node.js Version',
        status: 'fail',
        message: `${nodeVersion} (>= 20 required)`
      });
    }
  }

  /**
   * Check if project has been built
   */
  private checkProjectBuild(): void {
    if (!existsSync(DIST_DIR)) {
      this.addResult({
        name: 'Project Build',
        status: 'fail',
        message: 'dist/ directory not found',
        fixable: true
      });
      return;
    }

    const requiredFiles = [
      'credentials/LumaApi.credentials.js',
      'nodes/Luma/Luma.node.js',
      'nodes/LumaTrigger/LumaTrigger.node.js',
      'package.json'
    ];

    const missingFiles = requiredFiles.filter(file => !existsSync(join(DIST_DIR, file)));

    if (missingFiles.length === 0) {
      this.addResult({
        name: 'Project Build',
        status: 'pass',
        message: 'All required files built successfully'
      });
    } else {
      this.addResult({
        name: 'Project Build',
        status: 'fail',
        message: `Missing files: ${missingFiles.join(', ')}`,
        fixable: true
      });
    }
  }

  /**
   * Check local environment setup
   */
  private checkLocalEnvironment(): void {
    if (!existsSync(N8N_LOCAL_ROOT)) {
      this.addResult({
        name: 'Local Environment',
        status: 'fail',
        message: '.n8n/.local/ directory not found',
        fixable: true
      });
      return;
    }

    const requiredDirs = [
      'n8n-data',
      'n8n-custom-nodes',
      'logs'
    ];

    const missingDirs = requiredDirs.filter(dir => !existsSync(join(N8N_LOCAL_ROOT, dir)));

    if (missingDirs.length === 0) {
      this.addResult({
        name: 'Local Environment',
        status: 'pass',
        message: 'All required directories exist'
      });
    } else {
      this.addResult({
        name: 'Local Environment',
        status: 'fail',
        message: `Missing directories: ${missingDirs.join(', ')}`,
        fixable: true
      });
    }
  }

  /**
   * Check environment configuration
   */
  private checkEnvironmentConfig(): void {
    if (!existsSync(ENV_FILE)) {
      this.addResult({
        name: 'Environment Config',
        status: 'fail',
        message: '.env file not found',
        fixable: true
      });
      return;
    }

    try {
      const envContent = readFileSync(ENV_FILE, 'utf-8');
      const requiredVars = [
        'N8N_USER_FOLDER',
        'N8N_CUSTOM_EXTENSIONS',
        'N8N_PORT'
      ];

      const missingVars = requiredVars.filter(varName => 
        !envContent.includes(`${varName}=`)
      );

      if (missingVars.length === 0) {
        this.addResult({
          name: 'Environment Config',
          status: 'pass',
          message: 'All required environment variables configured'
        });
      } else {
        this.addResult({
          name: 'Environment Config',
          status: 'fail',
          message: `Missing variables: ${missingVars.join(', ')}`,
          fixable: true
        });
      }
    } catch (error) {
      this.addResult({
        name: 'Environment Config',
        status: 'fail',
        message: `Error reading .env file: ${(error as Error).message}`
      });
    }
  }

  /**
   * Check if nodes are properly linked
   */
  private checkNodeLinking(): void {
    if (!existsSync(CUSTOM_NODES_DIR)) {
      this.addResult({
        name: 'Node Linking',
        status: 'fail',
        message: 'Custom nodes directory not found',
        fixable: true
      });
      return;
    }

    const requiredFiles = [
      'nodes/Luma/Luma.node.js',
      'nodes/LumaTrigger/LumaTrigger.node.js',
      'credentials/LumaApi.credentials.js',
      'package.json'
    ];

    const missingFiles = requiredFiles.filter(file => 
      !existsSync(join(CUSTOM_NODES_DIR, file))
    );

    if (missingFiles.length === 0) {
      this.addResult({
        name: 'Node Linking',
        status: 'pass',
        message: 'All nodes properly linked to custom directory'
      });
    } else {
      this.addResult({
        name: 'Node Linking',
        status: 'fail',
        message: `Missing linked files: ${missingFiles.join(', ')}`,
        fixable: true
      });
    }
  }

  /**
   * Check n8n availability
   */
  private checkN8nAvailability(): void {
    try {
      // First check if n8n is globally installed (fast)
      execSync('n8n --version', { stdio: 'pipe', timeout: 5000 });
      this.addResult({
        name: 'n8n Availability',
        status: 'pass',
        message: 'Available globally'
      });
      return;
    } catch {
      // Check if npx is available (don't try to download n8n)
      try {
        execSync('npx --version', { stdio: 'pipe', timeout: 5000 });
        this.addResult({
          name: 'n8n Availability',
          status: 'pass',
          message: 'Will be downloaded via npx when needed'
        });
        return;
      } catch {
        this.addResult({
          name: 'n8n Availability',
          status: 'warn',
          message: 'npx not available, install Node.js with npm'
        });
      }
    }
  }

  /**
   * Check package manager (pnpm)
   */
  private checkPackageManager(): void {
    try {
      execSync('pnpm --version', { stdio: 'pipe' });
      this.addResult({
        name: 'Package Manager',
        status: 'pass',
        message: 'pnpm available'
      });
    } catch {
      this.addResult({
        name: 'Package Manager',
        status: 'fail',
        message: 'pnpm not found (required for build scripts)'
      });
    }
  }

  /**
   * Run all health checks
   */
  async runChecks(): Promise<void> {
    console.log('🔍 Running health checks for local n8n testing environment...\n');

    this.checkNodeVersion();
    this.checkPackageManager();
    this.checkProjectBuild();
    this.checkLocalEnvironment();
    this.checkEnvironmentConfig();
    this.checkNodeLinking();
    this.checkN8nAvailability();
  }

  /**
   * Display summary and recommendations
   */
  displaySummary(): void {
    const passed = this.results.filter(r => r.status === 'pass').length;
    const warned = this.results.filter(r => r.status === 'warn').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    const fixable = this.results.filter(r => r.status === 'fail' && r.fixable).length;

    console.log(`\n📊 Health Check Summary:`);
    console.log(`  ✅ Passed: ${passed}`);
    console.log(`  ⚠️  Warnings: ${warned}`);
    console.log(`  ❌ Failed: ${failed}`);

    if (failed > 0) {
      console.log(`\n🔧 Recommended fixes:`);
      
      if (fixable > 0) {
        console.log(`  Run setup: pnpm run test:local:setup`);
        console.log(`  Build project: pnpm run build`);
        console.log(`  Link nodes: pnpm run test:local:link`);
      }

      console.log(`\n  Or run the complete workflow: pnpm run test:local`);
    } else if (warned > 0) {
      console.log(`\n✅ Environment is functional with minor warnings.`);
      console.log(`Ready to start: pnpm run test:local:start`);
    } else {
      console.log(`\n✅ Environment is healthy and ready!`);
      console.log(`Ready to start: pnpm run test:local:start`);
    }
  }

  /**
   * Get exit code based on results
   */
  getExitCode(): number {
    const hasFailed = this.results.some(r => r.status === 'fail');
    return hasFailed ? 1 : 0;
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options: HealthCheckOptions = {
  verbose: args.includes('--verbose') || args.includes('-v'),
  fix: args.includes('--fix') || args.includes('-f'),
};

// Show help if requested
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Health Check for Local n8n Testing Environment

Usage: tsx .n8n/scripts/health-check.ts [options]

Options:
  --fix, -f        Attempt to fix issues automatically (not implemented yet)
  --verbose, -v    Show detailed logging
  --help, -h       Show this help message

This script validates that the local testing environment is properly configured.
`);
  process.exit(0);
}

// Run health check
const checker = new HealthChecker(options);
checker.runChecks()
  .then(() => {
    checker.displaySummary();
    process.exit(checker.getExitCode());
  })
  .catch(console.error);