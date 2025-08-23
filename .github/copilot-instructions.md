# n8n-nodes-luma

This is an n8n community node package that provides integration with Luma's API for event management. The package allows users to interact with Luma events through n8n workflows.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Prerequisites and Environment Setup
- **Node.js**: Requires Node.js >= 22 (works with 20.19.4 but shows warnings)
- **Package Manager**: Uses pnpm as the package manager
- **Install pnpm globally**: `npm install -g pnpm`

### Bootstrap and Build Process
Run these commands in sequence to set up the development environment:

1. **Install dependencies**: `pnpm install` 
   - Takes 1-25 seconds (fast when packages cached, slower on first run)
   - NEVER CANCEL: Set timeout to 60+ seconds for safety
   - May show Node.js version warnings which can be ignored

2. **Build the package**: `pnpm run build`
   - Takes approximately 3 seconds
   - NEVER CANCEL: Set timeout to 30+ seconds for safety
   - Runs: clean → TypeScript compilation → icon copying via Gulp

3. **Development watch mode**: `pnpm run dev`
   - Starts TypeScript compiler in watch mode
   - Automatically rebuilds on file changes
   - Use Ctrl+C to stop

### Code Quality and Validation
Always run these commands before committing changes:

1. **Format code**: `pnpm run format`
   - Uses Prettier to format TypeScript files in nodes/ and credentials/
   - Takes approximately 1 second

2. **Lint code**: `pnpm run lint`
   - Uses ESLint with n8n-specific rules
   - May show TypeScript version compatibility warnings (can be ignored)
   - Takes approximately 3 seconds

3. **Fix lint issues automatically**: `pnpm run lintfix`
   - Auto-fixes ESLint issues where possible
   - Takes approximately 3 seconds

4. **Full validation**: `pnpm run prepublishOnly`
   - Runs complete build + lint with strict rules
   - Takes approximately 5-8 seconds
   - NEVER CANCEL: Set timeout to 60+ seconds for safety
   - Must pass before publishing to npm

### Manual Validation Requirements
**CRITICAL**: After making code changes, always validate functionality:

1. **Build and verify output**: Check that `dist/` contains expected files after build
   - Should contain: `nodes/Luma/Luma.node.js`, `credentials/LumaApi.credentials.js`, SVG icons
2. **Test node structure**: Ensure credentials and nodes are properly structured
3. **Validate TypeScript**: Confirm no compilation errors in watch mode
4. **Check ESLint rules**: All n8n-specific linting rules must pass
5. **Test scenario**: If possible, test node functionality in n8n development environment

### Validation Scenarios
After making changes, validate these key scenarios:
- **Node registration**: Ensure the node appears correctly in n8n UI
- **Credential configuration**: Test API key setup and authentication
- **Parameter display**: Verify resource/operation options show correctly
- **Basic execution**: Test placeholder functionality returns expected structure

## Repository Structure

### Key Directories and Files
```
├── .github/copilot-instructions.md  # This file
├── nodes/Luma/                      # Main node implementation
│   ├── Luma.node.ts                # Node logic and configuration
│   └── luma.svg                     # Node icon
├── credentials/                     # API credentials configuration
│   └── LumaApi.credentials.ts       # Luma API key setup
├── dist/                           # Build output (generated)
├── package.json                    # Project configuration
├── tsconfig.json                   # TypeScript configuration
├── .eslintrc.js                    # ESLint rules for development
├── .eslintrc.prepublish.js         # Strict ESLint rules for publishing
├── .prettierrc.js                  # Code formatting configuration
└── gulpfile.js                     # Icon copying build step
```

### Important Implementation Files
- **Main node**: `nodes/Luma/Luma.node.ts` - Contains the node description and execution logic
- **Credentials**: `credentials/LumaApi.credentials.ts` - Handles API authentication
- **Entry point**: `index.ts` - Package entry point (minimal, mostly empty)

## Development Workflow

### Making Changes to Nodes
1. **Always start with build validation**: Run `pnpm run build` to ensure current state works
2. **Use watch mode for development**: `pnpm run dev` for automatic recompilation
3. **Edit node files**: Modify files in `nodes/Luma/` directory
4. **Test TypeScript compilation**: Watch for errors in dev mode output
5. **Validate with lint**: Run `pnpm run lint` frequently during development
6. **Format before committing**: Always run `pnpm run format`

### Adding New Operations or Resources
- Edit `nodes/Luma/Luma.node.ts` to add new resources or operations
- Follow n8n node development patterns for parameter definitions
- Ensure proper TypeScript types are used
- Add appropriate display options and validation

### N8N Development Patterns
**Key patterns to follow when modifying nodes:**
- **displayOptions**: Use `show` property to conditionally display parameters
- **Parameter naming**: Use camelCase for internal names, proper display names for UI
- **Type safety**: Always import and use proper types from 'n8n-workflow'
- **Error handling**: Implement proper error handling in execute() method
- **Data flow**: Use `getInputData()` and return `INodeExecutionData[][]`
- **Credentials**: Reference credentials by name in node description

### Credentials Management
- Luma API credentials are configured in `credentials/LumaApi.credentials.ts`
- Uses API key authentication with header `x-luma-api-key`
- Test endpoint: `https://api.lu.ma/public/v1/calendar/get-events`

## Build System Details

### TypeScript Configuration
- Target: ES2023 with NodeNext module resolution
- Strict mode enabled with comprehensive type checking
- Outputs declaration files and source maps
- Incremental compilation for faster rebuilds

### ESLint Configuration
- **Development**: `.eslintrc.js` - Standard n8n rules
- **Publishing**: `.eslintrc.prepublish.js` - Stricter validation
- Specific rule sets for credentials files vs node files
- Automatic enforcement of n8n community package standards

### Build Process Flow
1. `pnpm run clean` - Removes dist/ directory
2. `tsc` - TypeScript compilation to dist/
3. `gulp build:icons` - Copies SVG icons to dist/

## Common Tasks and Outputs

### Quick Development Commands
Most common development workflow commands:
```bash
# Full development setup from scratch
pnpm install && pnpm run build

# Development cycle (while coding)
pnpm run dev  # Keep running in separate terminal
pnpm run format && pnpm run lint  # After making changes

# Pre-commit validation
pnpm run prepublishOnly

# Clean rebuild
pnpm run clean && pnpm run build
```

### Repository Root Contents
```
.editorconfig
.eslintrc.js  
.eslintrc.prepublish.js
.git
.gitignore
.npmignore
.prettierrc.js
.vscode/
CODE_OF_CONDUCT.md
LICENSE.md  
README.md
credentials/
gulpfile.js
index.ts
nodes/
package.json
pnpm-lock.yaml
tsconfig.json
```

### Package.json Key Scripts
```json
{
  "build": "pnpm run clean && tsc && gulp build:icons",
  "clean": "rimraf dist",
  "dev": "tsc --watch", 
  "format": "prettier nodes credentials --write",
  "lint": "eslint nodes credentials package.json",
  "lintfix": "eslint nodes credentials package.json --fix",
  "prepublishOnly": "pnpm run build && pnpm run lint -c .eslintrc.prepublish.js nodes credentials package.json"
}
```

## Troubleshooting

### Node.js Version Warnings
- Package requires Node.js >= 22 but works with 20.19.4
- Warnings like "Unsupported engine" can be safely ignored during development
- Production deployments should use Node.js 22+

### Build Failures
- **TypeScript errors**: Check TypeScript version compatibility and fix syntax errors
- **Missing dependencies**: Run `pnpm install` to ensure all packages are installed
- **Icon copy failures**: Ensure SVG files exist in source directories

### Linting Issues
- **Development vs. publish rules**: Different eslint configs for different stages
- **n8n-specific rules**: Follow n8n community package guidelines strictly
- **Fix automatically**: Use `pnpm run lintfix` for auto-fixable issues

## Testing and Validation

### Current State
- **No automated test suite** currently exists in the repository
- **Manual validation required** for all functionality changes
- **ESLint serves as primary validation** for code quality

### Validation Checklist
Before completing any changes:
- [ ] `pnpm run build` succeeds without errors
- [ ] `pnpm run lint` passes all checks  
- [ ] `pnpm run format` applied to all modified files
- [ ] `pnpm run prepublishOnly` completes successfully
- [ ] Node functionality manually tested in development environment
- [ ] API credentials tested with actual Luma API endpoints

**NEVER CANCEL long-running commands** - builds and validation steps must complete fully.

---

## Summary
This n8n community node package is well-structured and fast to build/test. All development commands are reliable and execute quickly (under 5 seconds each). The main development workflow involves: install dependencies → build → make changes in watch mode → format/lint → validate with prepublishOnly. The package follows n8n community standards and includes comprehensive ESLint rules for maintaining code quality.