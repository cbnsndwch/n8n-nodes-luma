#!/usr/bin/env tsx

import { spawn } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

/**
 * n8n startup script for local testing
 * Starts n8n with custom nodes and environment configuration
 */

const PROJECT_ROOT = resolve(__dirname, '../..');
const ENV_FILE = join(PROJECT_ROOT, '.n8n/.local/.env');
const CUSTOM_NODES_DIR = join(PROJECT_ROOT, '.n8n/.local/n8n-custom-nodes');

interface StartOptions {
  verbose?: boolean;
  tunnel?: boolean;
  open?: boolean;
}

class N8nStarter {
  private options: StartOptions;
  private envVars: Record<string, string> = {};

  constructor(options: StartOptions = {}) {
    this.options = options;
  }

  /**
   * Log message if verbose mode is enabled
   */
  private log(message: string): void {
    if (this.options.verbose) {
      console.log(`[START] ${message}`);
    }
  }

  /**
   * Load environment variables from .env file
   */
  private loadEnvironmentVariables(): void {
    if (!existsSync(ENV_FILE)) {
      throw new Error(`Environment file not found: ${ENV_FILE}. Run 'pnpm run test:local:setup' first.`);
    }

    this.log('Loading environment variables...');
    const envContent = readFileSync(ENV_FILE, 'utf-8');
    const lines = envContent.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, value] = trimmed.split('=', 2);
        if (key && value) {
          // Resolve relative paths to absolute paths
          let resolvedValue = value;
          if (value.startsWith('.n8n/')) {
            resolvedValue = resolve(PROJECT_ROOT, value);
          }
          this.envVars[key.trim()] = resolvedValue.trim();
        }
      }
    }

    this.log(`Loaded ${Object.keys(this.envVars).length} environment variables`);
  }

  /**
   * Validate that custom nodes are properly linked
   */
  private validateCustomNodes(): void {
    this.log('Validating custom nodes...');

    if (!existsSync(CUSTOM_NODES_DIR)) {
      throw new Error(`Custom nodes directory not found: ${CUSTOM_NODES_DIR}. Run 'pnpm run test:local:link' first.`);
    }

    // Check for required node files
    const requiredFiles = [
      'nodes/Luma/Luma.node.js',
      'nodes/LumaTrigger/LumaTrigger.node.js',
      'credentials/LumaApi.credentials.js'
    ];

    for (const file of requiredFiles) {
      const filePath = join(CUSTOM_NODES_DIR, file);
      if (!existsSync(filePath)) {
        throw new Error(`Required node file missing: ${file}. Run 'pnpm run test:local:link' first.`);
      }
    }

    this.log('✅ All required custom nodes found');
  }

  /**
   * Prepare environment for n8n startup
   */
  private prepareEnvironment(): Record<string, string> {
    const env = { ...process.env, ...this.envVars };

    // Add tunnel option if requested
    if (this.options.tunnel) {
      env.N8N_TUNNEL = 'true';
    }

    this.log('Environment prepared for n8n startup');
    return env;
  }

  /**
   * Start n8n process
   */
  private startN8nProcess(): Promise<void> {
    return new Promise((resolve, reject) => {
      const env = this.prepareEnvironment();
      
      console.log('\n🚀 Starting n8n with custom Luma nodes...\n');
      
      // Display startup information
      console.log('Configuration:');
      console.log(`  Port: ${this.envVars.N8N_PORT || '5678'}`);
      console.log(`  Host: ${this.envVars.N8N_HOST || 'localhost'}`);
      console.log(`  Data folder: ${this.envVars.N8N_USER_FOLDER || 'default'}`);
      console.log(`  Custom nodes: ${this.envVars.N8N_CUSTOM_EXTENSIONS || 'none'}`);
      
      if (this.options.tunnel) {
        console.log('  Tunnel: enabled');
      }
      
      console.log('\n');

      // Start n8n using npx
      const n8nArgs = ['n8n'];
      
      if (this.options.tunnel) {
        n8nArgs.push('--tunnel');
      }

      const n8nProcess = spawn('npx', n8nArgs, {
        stdio: 'inherit',
        env,
        cwd: PROJECT_ROOT
      });

      // Handle process events
      n8nProcess.on('error', (error) => {
        reject(new Error(`Failed to start n8n: ${error.message}`));
      });

      n8nProcess.on('exit', (code) => {
        if (code === 0) {
          console.log('\n✅ n8n stopped gracefully');
          resolve();
        } else {
          reject(new Error(`n8n exited with code ${code}`));
        }
      });

      // Handle graceful shutdown
      process.on('SIGINT', () => {
        console.log('\n🛑 Stopping n8n...');
        n8nProcess.kill('SIGINT');
      });

      process.on('SIGTERM', () => {
        console.log('\n🛑 Stopping n8n...');
        n8nProcess.kill('SIGTERM');
      });
    });
  }

  /**
   * Run the complete startup process
   */
  async start(): Promise<void> {
    try {
      this.loadEnvironmentVariables();
      this.validateCustomNodes();
      await this.startN8nProcess();

    } catch (error) {
      console.error('\n❌ Failed to start n8n:', (error as Error).message);
      console.error('\nTroubleshooting steps:');
      console.error('  1. Run: pnpm run test:local:setup');
      console.error('  2. Run: pnpm run build');
      console.error('  3. Run: pnpm run test:local:link');
      console.error('  4. Try again: pnpm run test:local:start');
      process.exit(1);
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options: StartOptions = {
  verbose: args.includes('--verbose') || args.includes('-v'),
  tunnel: args.includes('--tunnel') || args.includes('-t'),
  open: args.includes('--open') || args.includes('-o'),
};

// Show help if requested
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
n8n Startup for Local Testing

Usage: tsx .n8n/scripts/start-n8n.ts [options]

Options:
  --tunnel, -t     Enable n8n tunnel for external access
  --open, -o       Open browser automatically (not implemented yet)
  --verbose, -v    Show detailed logging
  --help, -h       Show this help message

This script starts n8n with custom Luma nodes loaded from the local environment.

Prerequisites:
  1. Run 'pnpm run test:local:setup' to set up the environment
  2. Run 'pnpm run build' to build the nodes
  3. Run 'pnpm run test:local:link' to link the nodes

Then you can start n8n with this script.
`);
  process.exit(0);
}

// Start n8n
const starter = new N8nStarter(options);
starter.start().catch(console.error);