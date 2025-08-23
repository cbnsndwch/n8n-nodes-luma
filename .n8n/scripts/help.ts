#!/usr/bin/env tsx

/**
 * Help script showing all available local testing commands
 */

console.log(`
🧪 n8n Local Testing Environment - Command Reference

## Quick Start Commands

🚀 pnpm run n8n
   Complete workflow: setup + build + link + start n8n
   Perfect for first-time setup or clean testing

🔧 pnpm run n8n:setup
   Set up local environment (directories, config, templates)
   Run this once or when starting fresh

## Development Commands

⚡ pnpm run n8n:dev
   Development mode: TypeScript watch + auto file linking
   Best for active development with automatic rebuilds

👀 pnpm run n8n:watch
   Watch dist/ for changes and auto-relink nodes
   Use in separate terminal while developing

## Individual Commands

🔗 pnpm run n8n:link [--clean]
   Link built nodes to local n8n custom directory
   Use --clean to start with fresh directory

🌐 pnpm run n8n:start [--tunnel] [--verbose]
   Start n8n with custom nodes loaded
   Use --tunnel for external access

🔍 pnpm run n8n:health [--verbose]
   Check environment health and readiness
   Use --verbose for detailed diagnostics

## Typical Workflows

### First Time Setup:
1. pnpm run n8n:setup     # Setup environment
2. pnpm run n8n           # Complete workflow

### Daily Development:
1. pnpm run n8n:dev            # Start watch mode
2. (In another terminal) pnpm run n8n:start
3. Make code changes             # Auto-rebuild & relink
4. Restart n8n to see changes    # Manual for now

### Testing Changes:
1. pnpm run build                # Build changes
2. pnpm run n8n:link      # Link new builds
3. (Restart n8n if running)      # See changes

### Troubleshooting:
1. pnpm run n8n:health    # Check what's wrong
2. pnpm run n8n:setup     # Reset environment
3. See .n8n/docs/TROUBLESHOOTING.md

## Access Points

🌐 n8n Web Interface: http://localhost:5678
📁 Data Directory: .n8n/.local/n8n-data
🎛️  Custom Nodes: .n8n/.local/n8n-custom-nodes
📋 Environment: .n8n/.local/.env
📚 Documentation: .n8n/docs/README.md

## Node Availability

After running the setup, you'll have:
✅ Luma (Action Node) - For Luma API operations
✅ LumaTrigger (Trigger Node) - For Luma events
✅ LumaApi (Credentials) - For API authentication

Happy developing! 🎉
`);