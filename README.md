# @cbnsndwch/n8n-nodes-luma

This package provides n8n community nodes for Luma's API, allowing you to integrate Luma events and functionality into your n8n workflows.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Luma Node

The Luma node currently supports the following operations:

#### Event
- **Get Many**: Retrieve multiple events from Luma

## Credentials

To use this node, you'll need to configure your Luma API credentials:

1. Get your API key from [Luma's API documentation](https://docs.lu.ma/api/getting-started)
2. In n8n, create new credentials of type "Luma API"
3. Enter your API key

### Development Commands

```bash
# Install dependencies
pnpm install

# Build the node
pnpm run build

# Watch for changes during development
pnpm run dev

# Lint the code
pnpm run lint

# Format the code
pnpm run format

# Run tests
pnpm run test

# Validate commit message (for last commit)
pnpm run commitlint
```

For detailed contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Release Process (Maintainers)

This package uses automated semantic versioning and GitHub workflows for releasing.

### Automated Semantic Versioning

Releases are automated using semantic-release based on conventional commit messages:

- **feat**: New feature (minor version bump)
- **fix**: Bug fix (patch version bump)  
- **BREAKING CHANGE**: Breaking change (major version bump)
- **docs**, **style**, **refactor**, **test**, **chore**: No version bump

### Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Examples:**
```bash
feat(event): add support for recurring events
fix(credentials): correct API key validation
docs(readme): update installation instructions
feat(luma): add new operation

BREAKING CHANGE: API authentication method changed
```

### Release Workflow

1. **Push commits** to `main` branch with conventional commit messages
2. **Automated process** handles:
   - Version determination based on commit messages
   - Package.json version update
   - Changelog generation
   - Git tag creation
   - GitHub release creation
   - npm package publishing

No manual version bumping or tagging required!

### Token Management

- **Permissions**: Use automation tokens with publish-only access
- **Rotation**: Update tokens quarterly for security
- **Scope**: Minimal permissions (package publishing only)

For detailed authentication configuration, see the [npm authentication documentation](docs/projects/005-npm-release-workflows/2-release-automation/story-2.2-npm-authentication.md).

## License

[MIT](LICENSE.md)