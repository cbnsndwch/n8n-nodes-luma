import { describe, test, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const rootDir = join(__dirname, '../../..');

describe('Semantic Versioning Configuration Tests', () => {
    describe('Semantic Release Configuration', () => {
        test('should have semantic-release configuration in package.json', () => {
            const packageJson = JSON.parse(
                readFileSync(join(rootDir, 'package.json'), 'utf-8')
            );

            expect(packageJson.release).toBeDefined();
            expect(packageJson.release.branches).toEqual(['main']);
            expect(packageJson.release.plugins).toBeDefined();
            expect(packageJson.release.plugins).toBeInstanceOf(Array);
        });

        test('should include all required semantic-release plugins', () => {
            const packageJson = JSON.parse(
                readFileSync(join(rootDir, 'package.json'), 'utf-8')
            );
            const plugins = packageJson.release.plugins;

            const expectedPlugins = [
                '@semantic-release/commit-analyzer',
                '@semantic-release/release-notes-generator',
                '@semantic-release/changelog',
                '@semantic-release/npm',
                '@semantic-release/github'
            ];

            expectedPlugins.forEach(plugin => {
                const hasPlugin = plugins.some((p: any) =>
                    typeof p === 'string' ? p === plugin : p[0] === plugin
                );
                expect(hasPlugin).toBe(true);
            });
        });

        test('should have git plugin with correct configuration', () => {
            const packageJson = JSON.parse(
                readFileSync(join(rootDir, 'package.json'), 'utf-8')
            );
            const plugins = packageJson.release.plugins;

            const gitPlugin = plugins.find(
                (p: any) => Array.isArray(p) && p[0] === '@semantic-release/git'
            );

            expect(gitPlugin).toBeDefined();
            expect(gitPlugin[1].assets).toEqual([
                'package.json',
                'CHANGELOG.md'
            ]);
            expect(gitPlugin[1].message).toContain('chore(release)');
            expect(gitPlugin[1].message).toContain('[skip ci]');
        });
    });

    describe('Dependencies', () => {
        test('should have semantic-release dependencies installed', () => {
            const packageJson = JSON.parse(
                readFileSync(join(rootDir, 'package.json'), 'utf-8')
            );
            const devDeps = packageJson.devDependencies;

            const requiredDeps = [
                'semantic-release',
                '@semantic-release/commit-analyzer',
                '@semantic-release/release-notes-generator',
                '@semantic-release/changelog',
                '@semantic-release/npm',
                '@semantic-release/git',
                '@semantic-release/github'
            ];

            requiredDeps.forEach(dep => {
                expect(devDeps[dep]).toBeDefined();
            });
        });

        test('should have commitlint dependencies installed', () => {
            const packageJson = JSON.parse(
                readFileSync(join(rootDir, 'package.json'), 'utf-8')
            );
            const devDeps = packageJson.devDependencies;

            expect(devDeps['@commitlint/cli']).toBeDefined();
            expect(devDeps['@commitlint/config-conventional']).toBeDefined();
        });
    });

    describe('Commit Lint Configuration', () => {
        test('should have commitlint configuration file', () => {
            const configExists = require('fs').existsSync(
                join(rootDir, 'commitlint.config.js')
            );
            expect(configExists).toBe(true);
        });

        test('should have commitlint script in package.json', () => {
            const packageJson = JSON.parse(
                readFileSync(join(rootDir, 'package.json'), 'utf-8')
            );
            expect(packageJson.scripts.commitlint).toBeDefined();
            expect(packageJson.scripts.commitlint).toContain('commitlint');
        });
    });

    describe('Documentation', () => {
        test('should have CONTRIBUTING.md with conventional commit guidelines', () => {
            const contributingExists = require('fs').existsSync(
                join(rootDir, 'CONTRIBUTING.md')
            );
            expect(contributingExists).toBe(true);

            const contributing = readFileSync(
                join(rootDir, 'CONTRIBUTING.md'),
                'utf-8'
            );
            expect(contributing).toContain('Conventional Commits');
            expect(contributing).toContain('feat:');
            expect(contributing).toContain('fix:');
            expect(contributing).toContain('BREAKING CHANGE');
        });

        test('should have CHANGELOG.md file', () => {
            const changelogExists = require('fs').existsSync(
                join(rootDir, 'CHANGELOG.md')
            );
            expect(changelogExists).toBe(true);

            const changelog = readFileSync(
                join(rootDir, 'CHANGELOG.md'),
                'utf-8'
            );
            expect(changelog).toContain('# Changelog');
            expect(changelog).toContain('[Unreleased]');
        });
    });

    describe('Workflow Files', () => {
        test('should have semantic-release workflow', () => {
            const workflowExists = require('fs').existsSync(
                join(rootDir, '.github/workflows/semantic-release.yml')
            );
            expect(workflowExists).toBe(true);

            const workflow = readFileSync(
                join(rootDir, '.github/workflows/semantic-release.yml'),
                'utf-8'
            );
            expect(workflow).toContain('name: Semantic Release');
            expect(workflow).toContain('npx semantic-release');
            expect(workflow).toContain('GITHUB_TOKEN');
            expect(workflow).toContain('NPM_TOKEN');
        });

        test('should have updated release workflow to use GitHub releases', () => {
            const releaseWorkflow = readFileSync(
                join(rootDir, '.github/workflows/release.yml'),
                'utf-8'
            );
            expect(releaseWorkflow).toContain('release:');
            expect(releaseWorkflow).toContain('types: [published]');
            expect(releaseWorkflow).not.toContain('tags:');
        });
    });
});
