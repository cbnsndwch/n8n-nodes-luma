#!/usr/bin/env tsx

import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, resolve, extname } from 'path';

/**
 * Node linking script for local n8n testing
 * Copies built nodes from dist/ to .n8n/.local/n8n-custom-nodes/
 */

const PROJECT_ROOT = resolve(__dirname, '../..');
const DIST_DIR = join(PROJECT_ROOT, 'dist');
const CUSTOM_NODES_DIR = join(PROJECT_ROOT, '.n8n/.local/n8n-custom-nodes');

interface LinkOptions {
  verbose?: boolean;
  clean?: boolean;
}

class NodeLinker {
  private options: LinkOptions;

  constructor(options: LinkOptions = {}) {
    this.options = options;
  }

  /**
   * Log message if verbose mode is enabled
   */
  private log(message: string): void {
    if (this.options.verbose) {
      console.log(`[LINK] ${message}`);
    }
  }

  /**
   * Ensure directory exists, create if it doesn't
   */
  private ensureDirectory(dirPath: string): void {
    if (!existsSync(dirPath)) {
      this.log(`Creating directory: ${dirPath}`);
      mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Recursively copy files from source to destination
   */
  private copyRecursive(source: string, destination: string): void {
    if (!existsSync(source)) {
      throw new Error(`Source directory does not exist: ${source}`);
    }

    this.ensureDirectory(destination);

    const items = readdirSync(source);

    for (const item of items) {
      const sourcePath = join(source, item);
      const destPath = join(destination, item);
      const stat = statSync(sourcePath);

      if (stat.isDirectory()) {
        this.copyRecursive(sourcePath, destPath);
      } else {
        this.log(`Copying file: ${sourcePath} -> ${destPath}`);
        copyFileSync(sourcePath, destPath);
      }
    }
  }

  /**
   * Validate that built files exist and are complete
   */
  private validateBuiltFiles(): void {
    this.log('Validating built files...');

    if (!existsSync(DIST_DIR)) {
      throw new Error(`Build directory not found: ${DIST_DIR}. Run 'pnpm run build' first.`);
    }

    // Check for essential files
    const requiredFiles = [
      'credentials/LumaApi.credentials.js',
      'nodes/Luma/Luma.node.js',
      'nodes/LumaTrigger/LumaTrigger.node.js',
      'package.json'
    ];

    for (const file of requiredFiles) {
      const filePath = join(DIST_DIR, file);
      if (!existsSync(filePath)) {
        throw new Error(`Required file missing: ${file}. Build may be incomplete.`);
      }
    }

    this.log('✅ All required files found in dist/');
  }

  /**
   * Link nodes by copying built files to custom nodes directory
   */
  private linkNodes(): void {
    this.log('Linking nodes to custom directory...');

    // Ensure custom nodes directory exists
    this.ensureDirectory(CUSTOM_NODES_DIR);

    // Copy all built files to custom nodes directory
    this.copyRecursive(DIST_DIR, CUSTOM_NODES_DIR);

    // Fix package.json to remove 'dist/' prefixes from paths
    this.fixPackageJsonPaths();

    this.log('✅ Nodes linked successfully');
  }

  /**
   * Fix package.json paths to remove 'dist/' prefix
   */
  private fixPackageJsonPaths(): void {
    const packageJsonPath = join(CUSTOM_NODES_DIR, 'package.json');
    
    if (existsSync(packageJsonPath)) {
      this.log('Fixing package.json paths...');
      
      const { readFileSync, writeFileSync } = require('fs');
      let packageContent = readFileSync(packageJsonPath, 'utf-8');
      
      // Remove 'dist/' from the n8n configuration paths
      packageContent = packageContent.replace(/"dist\/credentials\//g, '"credentials/');
      packageContent = packageContent.replace(/"dist\/nodes\//g, '"nodes/');
      
      writeFileSync(packageJsonPath, packageContent);
      this.log('✅ Package.json paths fixed');
    }
  }

  /**
   * Clean the custom nodes directory
   */
  private cleanCustomNodes(): void {
    if (existsSync(CUSTOM_NODES_DIR)) {
      this.log('Cleaning custom nodes directory...');
      // Remove and recreate directory for clean state
      const { rmSync } = require('fs');
      rmSync(CUSTOM_NODES_DIR, { recursive: true, force: true });
      this.ensureDirectory(CUSTOM_NODES_DIR);
      this.log('✅ Custom nodes directory cleaned');
    }
  }

  /**
   * Count and report linked files
   */
  private reportLinkedFiles(): void {
    if (!existsSync(CUSTOM_NODES_DIR)) {
      return;
    }

    let fileCount = 0;
    let nodeCount = 0;
    let credentialCount = 0;

    const countFiles = (dir: string): void => {
      const items = readdirSync(dir);
      for (const item of items) {
        const itemPath = join(dir, item);
        const stat = statSync(itemPath);
        
        if (stat.isDirectory()) {
          countFiles(itemPath);
        } else {
          fileCount++;
          const ext = extname(item);
          if (ext === '.js' && item.includes('.node.')) {
            nodeCount++;
          } else if (ext === '.js' && item.includes('.credentials.')) {
            credentialCount++;
          }
        }
      }
    };

    countFiles(CUSTOM_NODES_DIR);

    console.log(`\n📊 Linked files summary:`);
    console.log(`  Total files: ${fileCount}`);
    console.log(`  Node files: ${nodeCount}`);
    console.log(`  Credential files: ${credentialCount}`);
  }

  /**
   * Run the complete linking process
   */
  async link(): Promise<void> {
    console.log('🔗 Linking Luma nodes for local testing...\n');

    try {
      if (this.options.clean) {
        this.cleanCustomNodes();
      }

      this.validateBuiltFiles();
      this.linkNodes();
      this.reportLinkedFiles();

      console.log('\n✅ Node linking complete!');
      console.log('\nYour nodes are now available in the local n8n environment.');
      console.log('Next step: pnpm run n8n:start');

    } catch (error) {
      console.error('\n❌ Node linking failed:', (error as Error).message);
      process.exit(1);
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options: LinkOptions = {
  verbose: args.includes('--verbose') || args.includes('-v'),
  clean: args.includes('--clean') || args.includes('-c'),
};

// Show help if requested
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Node Linking for Local n8n Testing

Usage: tsx .n8n/scripts/link-nodes.ts [options]

Options:
  --clean, -c      Clean custom nodes directory before linking
  --verbose, -v    Show detailed logging
  --help, -h       Show this help message

This script copies built nodes from dist/ to the local n8n custom nodes directory.
`);
  process.exit(0);
}

// Run linking
const linker = new NodeLinker(options);
linker.link().catch(console.error);