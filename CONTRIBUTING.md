# Contributing to n8n-nodes-luma

## Commit Message Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated semantic versioning and changelog generation.

### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature (triggers minor version bump)
- **fix**: A bug fix (triggers patch version bump)
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement (triggers patch version bump)
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Scopes

- **luma**: Changes to the main Luma action node
- **trigger**: Changes to the LumaTrigger node
- **credentials**: Changes to API credentials
- **calendar**: Calendar operation changes
- **event**: Event operation changes
- **guest**: Guest operation changes
- **ticket**: Ticket operation changes
- **user**: User operation changes
- **utility**: Utility operation changes
- **shared**: Shared utilities and base classes
- **workflow**: GitHub Actions workflow changes
- **deps**: Dependency updates
- **config**: Configuration changes
- **test**: Test-related changes
- **docs**: Documentation changes
- **release**: Release related changes

### Breaking Changes

To trigger a major version bump, include `BREAKING CHANGE:` in the commit footer:

```
feat(luma): add new event creation operation

BREAKING CHANGE: The event creation now requires a different parameter structure
```

### Examples

#### Feature (Minor Version Bump)
```
feat(event): add support for recurring events

- Added recurring event configuration
- Updated event creation parameters
- Added validation for recurrence rules
```

#### Bug Fix (Patch Version Bump)
```
fix(guest): correct guest status validation

Fixed issue where guest status was not properly validated
when updating guest information.
```

#### Breaking Change (Major Version Bump)
```
feat(credentials): update API authentication method

BREAKING CHANGE: Authentication now requires API key header instead of query parameter.
Users must update their credential configuration.
```

#### Documentation
```
docs(readme): update installation instructions

Added step-by-step installation guide and troubleshooting section.
```

#### Chore
```
chore(deps): update typescript to v5.8.3

Updated TypeScript dependency to latest version for better type safety.
```

## Version Bumping

The project uses automated semantic versioning based on commit messages:

- **Major** (1.0.0 → 2.0.0): Commits with `BREAKING CHANGE:` in footer
- **Minor** (1.0.0 → 1.1.0): Commits with `feat:` type
- **Patch** (1.0.0 → 1.0.1): Commits with `fix:` or `perf:` type

## Development Workflow

1. Create a feature branch from `main`
2. Make your changes following the coding standards
3. Write tests for your changes
4. Ensure all tests pass: `pnpm run test`
5. Validate build: `pnpm run build`
6. Check code quality: `pnpm run lint`
7. Format code: `pnpm run format`
8. Commit with conventional commit message
9. Push and create a pull request

## Validation Commands

```bash
# Install dependencies
pnpm install

# Build the project
pnpm run build

# Run all tests
pnpm run test

# Lint code
pnpm run lint

# Format code
pnpm run format

# Validate commit message (for last commit)
pnpm run commitlint

# Full pre-publish validation
pnpm run prepublishOnly
```

## Release Process

Releases are automated using semantic-release:

1. When commits are pushed to `main` branch, semantic-release analyzes commit messages
2. If releasable changes are detected, it:
   - Determines the next version number
   - Updates `package.json` version
   - Generates `CHANGELOG.md`
   - Creates a git tag
   - Creates a GitHub release
   - Publishes to npm registry

No manual version bumping or tagging is required!