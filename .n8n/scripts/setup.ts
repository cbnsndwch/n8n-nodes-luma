#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

/**
 * Cross-platform setup script for local n8n testing environment
 * Sets up .n8n/.local directory structure and configuration
 */

const PROJECT_ROOT = resolve(__dirname, '../..');
const N8N_LOCAL_ROOT = join(PROJECT_ROOT, '.n8n/.local');
const ENV_TEMPLATE = join(PROJECT_ROOT, '.n8n/config/.env.template');
const ENV_LOCAL = join(N8N_LOCAL_ROOT, '.env');
const PACKAGE_TEMPLATE = join(PROJECT_ROOT, '.n8n/config/package.json');
const PACKAGE_LOCAL = join(N8N_LOCAL_ROOT, 'n8n-custom-nodes/package.json');

interface SetupOptions {
  force?: boolean;
  verbose?: boolean;
}

class LocalTestingSetup {
  private options: SetupOptions;

  constructor(options: SetupOptions = {}) {
    this.options = options;
  }

  /**
   * Log message if verbose mode is enabled
   */
  private log(message: string): void {
    if (this.options.verbose) {
      console.log(`[SETUP] ${message}`);
    }
  }

  /**
   * Check if Node.js version meets requirements
   */
  private checkNodeVersion(): void {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    this.log(`Checking Node.js version: ${nodeVersion}`);
    
    if (majorVersion < 20) {
      throw new Error(`Node.js >= 20 required, found ${nodeVersion}`);
    }
    
    if (majorVersion < 22) {
      console.warn(`⚠️  Node.js >= 22 recommended, found ${nodeVersion}`);
    }
  }

  /**
   * Ensure directory exists, create if it doesn't
   */
  private ensureDirectory(dirPath: string): void {
    if (!existsSync(dirPath)) {
      this.log(`Creating directory: ${dirPath}`);
      mkdirSync(dirPath, { recursive: true });
    } else {
      this.log(`Directory exists: ${dirPath}`);
    }
  }

  /**
   * Copy file if it doesn't exist or force flag is set
   */
  private copyIfNeeded(source: string, destination: string): void {
    const shouldCopy = this.options.force || !existsSync(destination);
    
    if (shouldCopy) {
      this.log(`Copying ${source} -> ${destination}`);
      copyFileSync(source, destination);
    } else {
      this.log(`File exists (skipping): ${destination}`);
    }
  }

  /**
   * Check if n8n is available (either globally or via npx)
   */
  private checkN8nAvailability(): void {
    this.log('Checking n8n availability...');
    
    try {
      // First check if n8n is globally installed (fast)
      execSync('n8n --version', { stdio: 'pipe', timeout: 5000 });
      this.log('✅ n8n available globally');
      return;
    } catch {
      // Check if npx is available (don't try to download n8n yet)
      try {
        execSync('npx --version', { stdio: 'pipe', timeout: 5000 });
        this.log('✅ npx available (n8n will be downloaded when needed)');
        console.warn('⚠️  n8n will be downloaded via npx on first use (this may take a moment).');
        return;
      } catch {
        console.warn('⚠️  Neither n8n nor npx found. Please install Node.js with npm.');
      }
    }
  }

  /**
   * Setup local environment configuration
   */
  private setupEnvironment(): void {
    this.log('Setting up environment configuration...');
    
    // Create .env file from template
    this.copyIfNeeded(ENV_TEMPLATE, ENV_LOCAL);
    
    // Validate .env file has correct paths (resolve relative paths)
    if (existsSync(ENV_LOCAL)) {
      let envContent = readFileSync(ENV_LOCAL, 'utf-8');
      const updatedContent = envContent.replace(/^N8N_USER_FOLDER=.*$/m, 
        `N8N_USER_FOLDER=${join(N8N_LOCAL_ROOT, 'n8n-data')}`);
      const finalContent = updatedContent.replace(/^N8N_CUSTOM_EXTENSIONS=.*$/m, 
        `N8N_CUSTOM_EXTENSIONS=${join(N8N_LOCAL_ROOT, 'n8n-custom-nodes')}`);
      
      if (finalContent !== envContent) {
        this.log('Updating .env with absolute paths');
        writeFileSync(ENV_LOCAL, finalContent);
      }
    }
  }

  /**
   * Setup custom nodes directory structure
   */
  private setupCustomNodes(): void {
    this.log('Setting up custom nodes directory...');
    
    const customNodesDir = join(N8N_LOCAL_ROOT, 'n8n-custom-nodes');
    this.ensureDirectory(customNodesDir);
    this.ensureDirectory(join(customNodesDir, 'nodes'));
    this.ensureDirectory(join(customNodesDir, 'credentials'));
    
    // Copy package.json template
    this.copyIfNeeded(PACKAGE_TEMPLATE, PACKAGE_LOCAL);
  }

  /**
   * Create all required directories
   */
  private createDirectories(): void {
    this.log('Creating directory structure...');
    
    const directories = [
      N8N_LOCAL_ROOT,
      join(N8N_LOCAL_ROOT, 'n8n-data'),
      join(N8N_LOCAL_ROOT, 'n8n-custom-nodes'),
      join(N8N_LOCAL_ROOT, 'logs'),
    ];
    
    directories.forEach(dir => this.ensureDirectory(dir));
  }

  /**
   * Run the complete setup process
   */
  async setup(): Promise<void> {
    console.log('🚀 Setting up local n8n testing environment...\n');
    
    try {
      this.checkNodeVersion();
      this.createDirectories();
      this.setupEnvironment();
      this.setupCustomNodes();
      this.checkN8nAvailability();
      
      console.log('\n✅ Local testing environment setup complete!');
      console.log('\nNext steps:');
      console.log('  1. Run: pnpm run build');
      console.log('  2. Run: pnpm run n8n:link');
      console.log('  3. Run: pnpm run n8n:start');
      console.log('\nOr use the all-in-one command:');
      console.log('  pnpm run n8n');
      
    } catch (error) {
      console.error('\n❌ Setup failed:', (error as Error).message);
      process.exit(1);
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options: SetupOptions = {
  force: args.includes('--force') || args.includes('-f'),
  verbose: args.includes('--verbose') || args.includes('-v'),
};

// Show help if requested
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Local n8n Testing Environment Setup

Usage: tsx .n8n/scripts/setup.ts [options]

Options:
  --force, -f      Force overwrite existing files
  --verbose, -v    Show detailed logging
  --help, -h       Show this help message

This script sets up the local testing environment for n8n Luma nodes.
`);
  process.exit(0);
}

// Run setup
const setup = new LocalTestingSetup(options);
setup.setup().catch(console.error);