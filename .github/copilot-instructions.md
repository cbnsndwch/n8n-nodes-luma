# n8n-nodes-luma

n8n community nodes for Luma's API. This is a TypeScript-based n8n community node package that provides integration with Luma (lu.ma) event management platform.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Initial Setup and Dependencies
- **NEVER CANCEL: Dependency installation can take 15-30 minutes in some environments.** Always set timeout to 45+ minutes.
- Download and install Node.js 20.x (required for n8n compatibility):
  ```bash
  curl -fsSL https://nodejs.org/dist/v20.16.0/node-v20.16.0-linux-x64.tar.xz -o node.tar.xz
  tar xf node.tar.xz && mv node-v20.16.0-linux-x64 node
  export PATH="$(pwd)/node/bin:$PATH"
  ```
- Verify Node.js installation: `node --version` should show v20.16.0 or similar
- Install pnpm globally: `npm install -g pnpm` (takes 1-2 minutes)
- Install dependencies: `pnpm install` -- **NEVER CANCEL: Can take 15-30 minutes.** Set timeout to 45+ minutes.

### Project Structure
The repository follows standard n8n community node structure:
```
├── credentials/           # API credential definitions
├── nodes/                # Node implementations
├── dist/                 # Compiled output (auto-generated)
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
├── .eslintrc.js          # ESLint configuration
└── jest.config.js        # Jest test configuration
```

### Development Workflow
- **Build**: `pnpm run build` -- **NEVER CANCEL: Takes 5-15 minutes depending on project size.** Set timeout to 20+ minutes.
- **Development**: `pnpm run dev` -- Starts TypeScript watch mode for development
- **Linting**: `pnpm run lint` -- Runs ESLint validation (takes 1-2 minutes)
- **Linting (auto-fix)**: `pnpm run lintfix` -- Auto-fixes linting issues
- **Formatting**: `pnpm run format` -- Formats code with Prettier
- **Testing**: `pnpm run test` -- **NEVER CANCEL: Can take 5-10 minutes.** Set timeout to 15+ minutes.

### Build Process Details
1. TypeScript compilation: `tsc` compiles .ts files to .js in dist/
2. Icon processing: `gulp build:icons` processes node icons (if using gulp)
3. Build time: Typically 2-5 minutes for small projects, up to 15 minutes for larger ones
4. **Always run `pnpm run build` before testing in n8n**

## Validation

### Manual Testing Requirements
After making any changes to node functionality:
1. **Always run the complete build process** before testing
2. **Test in actual n8n instance**: Install the package in an n8n environment and test the node
3. **Test all operations**: For each node operation, verify it works with real API calls
4. **Test error handling**: Verify nodes handle API errors gracefully
5. **Test credentials**: Ensure authentication works correctly

### Pre-commit Validation
Before committing changes, **ALWAYS** run:
1. `pnpm run lint` -- Must pass without errors
2. `pnpm run format` -- Formats code consistently
3. `pnpm run build` -- Must complete successfully
4. `pnpm run test` -- All tests must pass

### CI/CD Considerations
- The package should build successfully in Node.js 18.10+ and 20.x environments
- All ESLint rules from 'eslint-plugin-n8n-nodes-base' must pass
- TypeScript compilation must complete without errors
- Package must follow n8n community node conventions

## Common Development Tasks

### Adding a New Node
1. Create new .ts file in `nodes/[NodeName]/[NodeName].node.ts`
2. Implement INodeType interface with proper description and execute method
3. Add node to package.json under n8n.nodes array
4. Run `pnpm run build` to compile
5. Test in n8n instance

### Adding New Credentials
1. Create .ts file in `credentials/[CredentialName].credentials.ts`
2. Implement ICredentialType interface
3. Add credential to package.json under n8n.credentials array
4. Run `pnpm run build` to compile

### Updating Dependencies
- **Use exact versions** for n8n-workflow and n8n-core (e.g., "~1.24.0")
- Always test compatibility after updates
- **NEVER CANCEL: `pnpm update` can take 20-30 minutes.** Set timeout to 45+ minutes.

## Troubleshooting

### Common Build Issues
- **"Cannot find module 'n8n-workflow'"**: Run `pnpm install` to install dependencies
- **TypeScript compilation errors**: Check tsconfig.json configuration and ensure proper imports
- **ESLint errors**: Run `pnpm run lintfix` to auto-fix, then manually fix remaining issues
- **Build timeouts**: Increase timeout values, builds can take 15+ minutes in some environments

### Development Environment Issues
- **Node.js version conflicts**: Ensure Node.js 20.x is being used (`node --version`)
- **Package manager issues**: Use pnpm instead of npm for consistency with n8n ecosystem
- **Missing dependencies**: Delete node_modules and pnpm-lock.yaml, then run `pnpm install`

### Testing in n8n
- Install package in n8n: `npm install /path/to/your/package` in n8n installation
- Restart n8n after installing community nodes
- Check n8n logs for any load errors
- Verify nodes appear in node palette

## Critical Timing Information

**BUILD COMMANDS (NEVER CANCEL):**
- `pnpm install`: 15-30 minutes (set timeout: 45+ minutes)
- `pnpm run build`: 5-15 minutes (set timeout: 20+ minutes)  
- `pnpm run test`: 5-10 minutes (set timeout: 15+ minutes)
- `pnpm update`: 20-30 minutes (set timeout: 45+ minutes)

**QUICK COMMANDS:**
- `pnpm run lint`: 1-2 minutes
- `pnpm run format`: 30 seconds - 1 minute
- `tsc --noEmit`: 10-30 seconds (syntax check only)

## Repository-Specific Information

### Package Configuration
- **Package manager**: pnpm (configured in package.json)
- **Node.js requirement**: >=18.10
- **n8n API version**: 1 (specified in package.json n8n.n8nNodesApiVersion)
- **Main entry**: index.js (compiled from TypeScript)

### Key Files and Their Purposes
- **package.json**: Defines n8n.nodes and n8n.credentials arrays for registration
- **tsconfig.json**: TypeScript compilation settings for n8n compatibility
- **.eslintrc.js**: ESLint configuration with n8n-specific rules
- **dist/**: Contains compiled JavaScript files that n8n actually loads

### API Integration Notes
- Luma API documentation: https://docs.lu.ma/
- Requires API key authentication
- Main resources: Events, Users, Calendars
- Rate limiting may apply - implement proper error handling

Always verify any commands work in your specific environment before relying on them. If network connectivity issues prevent dependency installation, document the limitation clearly.