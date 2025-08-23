# Local Testing Environment for n8n Luma Nodes

This directory contains the complete local testing environment for developing and testing the n8n Luma nodes in a local n8n instance.

## Quick Start

### Prerequisites
- **Node.js**: >= 20 (>= 22 recommended)
- **pnpm**: Package manager (install with `npm install -g pnpm`)
- **n8n**: Will be downloaded automatically via `npx n8n`

### One-Command Setup
```bash
# Complete setup and start n8n with nodes
pnpm run n8n
```

### Step-by-Step Setup
```bash
# 1. Set up local environment
pnpm run n8n:setup

# 2. Build the nodes
pnpm run build

# 3. Link nodes to local n8n
pnpm run n8n:link

# 4. Start n8n with custom nodes
pnpm run n8n:start
```

### Development Workflow
```bash
# Start development with watch mode + auto-linking
pnpm run n8n:dev
```

## Directory Structure

```
.n8n/
├── scripts/                    # TypeScript automation scripts
│   ├── setup.ts               # Environment setup
│   ├── link-nodes.ts          # Node linking
│   ├── start-n8n.ts           # n8n startup
│   └── health-check.ts        # Environment validation
├── config/                     # Configuration templates
│   ├── .env.template          # Environment variables
│   └── package.json           # Local package config
├── docs/                       # Documentation
│   ├── README.md              # This file
│   └── TROUBLESHOOTING.md     # Common issues
├── .local/                     # Local files (gitignored)
│   ├── n8n-data/              # n8n database and settings
│   ├── n8n-custom-nodes/      # Linked node files
│   ├── logs/                  # Log files
│   └── .env                   # Environment configuration
└── .gitignore                  # Ignore .local/ contents
```

## Available Scripts

### Setup and Environment
- **`pnpm run n8n:setup`** - Set up local testing environment
- **`pnpm run n8n:health`** - Check environment health
- **`pnpm run n8n:link`** - Link built nodes to n8n

### Running n8n
- **`pnpm run n8n:start`** - Start n8n with custom nodes
- **`pnpm run n8n`** - Complete workflow (build + link + start)

### Development
- **`pnpm run n8n:dev`** - Development mode with watch and auto-linking

## How It Works

### Node Loading Strategy
The local testing environment uses n8n's `N8N_CUSTOM_EXTENSIONS` environment variable to load custom nodes:

1. **Build Phase**: TypeScript nodes are compiled to `dist/`
2. **Link Phase**: Built files are copied to `.n8n/.local/n8n-custom-nodes/`
3. **Load Phase**: n8n reads nodes from the custom directory
4. **Runtime**: Nodes appear in n8n UI as if installed from npm

### Environment Configuration
The `.env` file in `.n8n/.local/` configures n8n for local development:

```bash
N8N_USER_FOLDER=.n8n/.local/n8n-data          # Isolated data directory
N8N_CUSTOM_EXTENSIONS=.n8n/.local/n8n-custom-nodes  # Custom nodes path
N8N_PORT=5678                                  # Local development port
N8N_HOST=localhost                             # Local access only
```

### Development Workflow
During development, the workflow supports rapid iteration:

1. **Make changes** to TypeScript files in `nodes/` or `credentials/`
2. **Auto-rebuild** (if using `pnpm run dev`)
3. **Auto-link** (if using `pnpm run n8n:dev`)
4. **Manual restart** n8n to see changes (future: hot reload)

## Testing Your Nodes

### 1. Access Local n8n
After starting with `pnpm run n8n:start`, open:
- **URL**: http://localhost:5678
- **Default**: No authentication required in local mode

### 2. Find Your Nodes
Look for your custom nodes in the n8n node panel:
- **Luma** - Action node for Luma API operations
- **Luma Trigger** - Trigger node for Luma events

### 3. Configure Credentials
1. Create new **LumaApi** credentials
2. Enter your Luma API key
3. Test the connection

### 4. Create Test Workflows
Build simple workflows to test node functionality:
- Create event
- List events  
- Update event
- Delete event

## Environment Variables

### Required Variables
- `N8N_USER_FOLDER` - n8n data directory
- `N8N_CUSTOM_EXTENSIONS` - Custom nodes directory
- `N8N_PORT` - Port for n8n web interface

### Optional Variables
- `N8N_HOST` - Host interface (default: localhost)
- `N8N_PROTOCOL` - Protocol (default: http)
- `N8N_LOG_LEVEL` - Logging level (default: info)
- `N8N_TUNNEL` - Enable tunnel for external access

### Development Variables
- `NODE_ENV` - Set to 'development'
- `N8N_DISABLE_PRODUCTION_MAIN_PROCESS` - Disable production checks
- `N8N_DIAGNOSTICS_ENABLED` - Disable telemetry

## Cross-Platform Support

All scripts are written in TypeScript and executed with `tsx` for cross-platform compatibility:

- **Windows**: Full support with proper path handling
- **macOS**: Native support
- **Linux**: Native support
- **WSL**: Supported via Linux compatibility

Path handling uses Node.js built-in `path` module for cross-platform file operations.

## File Watching and Hot Reload

### Current Approach
- TypeScript watch mode rebuilds files on changes
- Manual re-linking required after rebuild
- n8n restart required to see changes

### Future Enhancements
- Automatic re-linking on file changes
- Hot reload without n8n restart
- File system watching with cross-platform support

## Troubleshooting

For common issues and solutions, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md).

### Quick Diagnostics
```bash
# Check environment health
pnpm run n8n:health

# Verbose health check
pnpm run n8n:health --verbose

# Clean setup from scratch
rm -rf .n8n/.local
pnpm run n8n:setup
```

## Security Considerations

### Local Development Only
This environment is designed for local development only:
- No authentication enabled
- HTTP only (no HTTPS)
- Localhost binding only
- Isolated data directory

### Production Deployment
**Never use this configuration for production**:
- Use proper authentication
- Enable HTTPS
- Use production environment variables
- Deploy via official n8n installation methods

## Integration with CI/CD

The local testing environment can be integrated with CI/CD pipelines:

```yaml
# Example GitHub Actions step
- name: Test nodes locally
  run: |
    pnpm install
    pnpm run n8n:setup
    pnpm run build
    pnpm run n8n:health
```

For automated testing, consider using headless mode or API testing approaches.

## Contributing

When contributing to the local testing environment:

1. **Test cross-platform** - Verify on Windows, macOS, and Linux
2. **Follow TypeScript patterns** - Use proper types and error handling
3. **Update documentation** - Keep README and troubleshooting current
4. **Validate scripts** - Ensure all scripts work with fresh setup

## Support

- **Issues**: Report in the main repository issue tracker
- **Questions**: Check troubleshooting guide first
- **Feature Requests**: Open discussion in repository