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

## License

[MIT](LICENSE.md)