#!/usr/bin/env tsx

/**
 * Watch mode script for local development
 * Watches for changes in dist/ and re-links nodes automatically
 */

import { spawn } from 'child_process';
import { watch } from 'fs';
import { join, resolve } from 'path';

const PROJECT_ROOT = resolve(__dirname, '../..');
const DIST_DIR = join(PROJECT_ROOT, 'dist');

console.log('🔄 Starting watch mode for local n8n development...\n');

console.log('This will:');
console.log('1. Watch for changes in dist/ directory');
console.log('2. Automatically re-link nodes when files change');
console.log('3. You can manually restart n8n to see changes\n');

console.log('To start n8n in a separate terminal:');
console.log('  pnpm run n8n:start\n');

console.log('Press Ctrl+C to stop watching.\n');

// Initial link
console.log('🔗 Initial linking...');
try {
  spawn('tsx', ['.n8n/scripts/link-nodes.ts', '--clean'], {
    stdio: 'inherit',
    cwd: PROJECT_ROOT
  });
} catch (error) {
  console.error('Failed to do initial link:', error);
}

// Watch for changes
watch(DIST_DIR, { recursive: true }, (eventType, filename) => {
  if (filename && (filename.endsWith('.js') || filename.endsWith('.json'))) {
    console.log(`\n📄 File changed: ${filename}`);
    console.log('🔗 Re-linking nodes...');
    
    const linkProcess = spawn('tsx', ['.n8n/scripts/link-nodes.ts'], {
      stdio: 'pipe',
      cwd: PROJECT_ROOT
    });
    
    linkProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Nodes re-linked successfully');
        console.log('💡 Restart n8n to see changes');
      } else {
        console.error('❌ Re-linking failed');
      }
    });
  }
});

console.log('👀 Watching for changes in dist/ directory...');