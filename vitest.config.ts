import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.{test,spec}.{js,ts}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.n8n/**'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '.n8n/',
        '*.config.{js,ts}',
        'gulpfile.js'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@nodes': resolve(__dirname, './nodes'),
      '@credentials': resolve(__dirname, './credentials')
    }
  }
});