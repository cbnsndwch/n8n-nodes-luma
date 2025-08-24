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

## Development

To set up development environment:

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
```

## Release Process (Maintainers)

This package uses automated GitHub workflows for releasing. To set up npm authentication:

### npm Token Setup

1. **Generate npm token**:
   ```bash
   npm login  # If not already logged in
   npm token create --read-only=false --cidr-whitelist=0.0.0.0/0
   ```

2. **Configure GitHub Secret**:
   - Go to **Repository Settings > Secrets and Variables > Actions**
   - Add new secret named `NPM_TOKEN`
   - Use the token value from step 1

### Release Process

1. **Create a GitHub release** with semantic version tag (e.g., `v1.0.0`)
2. **Automated workflow** handles:
   - Build validation
   - npm authentication verification  
   - Package publishing
   - Publication verification

### Token Management

- **Permissions**: Use automation tokens with publish-only access
- **Rotation**: Update tokens quarterly for security
- **Scope**: Minimal permissions (package publishing only)

For detailed authentication configuration, see the [npm authentication documentation](docs/projects/005-npm-release-workflows/2-release-automation/story-2.2-npm-authentication.md).

## License

[MIT](LICENSE.md)