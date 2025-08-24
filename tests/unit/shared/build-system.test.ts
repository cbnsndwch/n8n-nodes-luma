import { describe, it, expect } from 'vitest';
import * as fs from 'fs';

describe('Build System Tests', () => {
    describe('Core Source Files', () => {
        it('should have main TypeScript source files', () => {
            expect(fs.existsSync('nodes/Luma/Luma.node.ts')).toBe(true);
            expect(fs.existsSync('nodes/LumaTrigger/LumaTrigger.node.ts')).toBe(
                true
            );
            expect(fs.existsSync('credentials/LumaApi.credentials.ts')).toBe(
                true
            );
        });

        it('should have feature source directories', () => {
            expect(fs.existsSync('nodes/Luma/calendar')).toBe(true);
            expect(fs.existsSync('nodes/Luma/event')).toBe(true);
            expect(fs.existsSync('nodes/Luma/guest')).toBe(true);
            expect(fs.existsSync('nodes/Luma/ticket')).toBe(true);
            expect(fs.existsSync('nodes/Luma/user')).toBe(true);
            expect(fs.existsSync('nodes/Luma/utility')).toBe(true);
            expect(fs.existsSync('nodes/Luma/shared')).toBe(true);
        });
    });

    describe('Build Output', () => {
        it('should have dist directory after build', () => {
            expect(fs.existsSync('dist')).toBe(true);
        });

        it('should have compiled JavaScript files', () => {
            expect(fs.existsSync('dist/nodes/Luma/Luma.node.js')).toBe(true);
            expect(
                fs.existsSync('dist/nodes/LumaTrigger/LumaTrigger.node.js')
            ).toBe(true);
            expect(
                fs.existsSync('dist/credentials/LumaApi.credentials.js')
            ).toBe(true);
        });

        it('should have TypeScript declaration files', () => {
            expect(fs.existsSync('dist/nodes/Luma/Luma.node.d.ts')).toBe(true);
            expect(
                fs.existsSync('dist/nodes/LumaTrigger/LumaTrigger.node.d.ts')
            ).toBe(true);
            expect(
                fs.existsSync('dist/credentials/LumaApi.credentials.d.ts')
            ).toBe(true);
        });

        it('should have built feature directories', () => {
            expect(fs.existsSync('dist/nodes/Luma/calendar')).toBe(true);
            expect(fs.existsSync('dist/nodes/Luma/event')).toBe(true);
            expect(fs.existsSync('dist/nodes/Luma/guest')).toBe(true);
            expect(fs.existsSync('dist/nodes/Luma/ticket')).toBe(true);
            expect(fs.existsSync('dist/nodes/Luma/user')).toBe(true);
            expect(fs.existsSync('dist/nodes/Luma/utility')).toBe(true);
            expect(fs.existsSync('dist/nodes/Luma/shared')).toBe(true);
        });
    });

    describe('Icon Assets', () => {
        it('should have source SVG icons', () => {
            expect(fs.existsSync('nodes/Luma/luma.svg')).toBe(true);
            expect(fs.existsSync('nodes/LumaTrigger/luma.svg')).toBe(true);
        });

        it('should have built SVG icons in dist', () => {
            expect(fs.existsSync('dist/nodes/Luma/luma.svg')).toBe(true);
            expect(fs.existsSync('dist/nodes/LumaTrigger/luma.svg')).toBe(true);
        });
    });

    describe('Package Configuration', () => {
        it('should have essential package files', () => {
            expect(fs.existsSync('package.json')).toBe(true);
            expect(fs.existsSync('tsconfig.json')).toBe(true);
            expect(fs.existsSync('vitest.config.ts')).toBe(true);
            expect(fs.existsSync('gulpfile.js')).toBe(true);
        });

        it('should have dist package.json after build', () => {
            expect(fs.existsSync('dist/package.json')).toBe(true);
        });
    });
});
