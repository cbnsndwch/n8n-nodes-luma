# [PROJ_003] Luma Nodes Local Testing Setup with n8n

## Overview

This project establishes a local development and testing environment that allows developers to test the Luma nodes from this repository in a local n8n instance launched via `npx n8n`. This setup enables rapid iteration and testing of node functionality during development.

## Current State Analysis

### ✅ Repository Assets
- **Node Package Structure**: Complete with Luma and LumaTrigger nodes
- **Build System**: Working TypeScript compilation with `pnpm` scripts
- **Code Quality**: ESLint, Prettier, and validation workflows in place
- **Credentials**: LumaApi credentials configuration implemented
- **Icons**: SVG icons for both nodes available

### ❌ Missing Components
- **Local n8n Environment**: No mechanism to test nodes locally
- **Node Installation Process**: No way to install built nodes into n8n
- **Development Workflow**: No integrated testing during development
- **Documentation**: No setup instructions for local testing

## Technical Requirements

### Environment Prerequisites
- **Node.js**: >= 22 (aligned with existing requirements)
- **Package Manager**: pnpm (for consistency with existing workflow)
- **n8n Installation**: Via `npx n8n` for lightweight local testing
- **Operating System**: Cross-platform support (Windows, macOS, Linux)

### Key Components Needed

#### 1. Local n8n Instance Configuration
- **Data Directory**: Isolated data storage for testing
- **Custom Nodes Path**: Mechanism to load development nodes
- **Environment Variables**: Configuration for local development
- **Port Configuration**: Avoiding conflicts with other services

#### 2. Node Installation Strategy
n8n recognizes community nodes through these mechanisms:
- **Global Installation**: `npm install -g n8n-nodes-package`
- **Local node_modules**: Symlink or copy to n8n's node_modules
- **Custom Nodes Directory**: Using `N8N_CUSTOM_EXTENSIONS` environment variable
- **Package.json Configuration**: Proper community node metadata

#### 3. Development Integration Points
- **Build Pipeline**: Extend existing `pnpm run build` to include local deployment
- **Watch Mode**: Auto-deploy changes during `pnpm run dev`
- **Validation**: Ensure local testing works with lint/format workflows
- **Hot Reload**: Minimize n8n restart requirements during development
- **TypeScript Scripts**: Use tsx to run TypeScript automation scripts directly

## Implementation Strategy

### Phase 1: Foundation Setup (Week 1)

#### 1.1 Create Local Testing Infrastructure
```
.n8n/                           # Local testing infrastructure (committed)
├── scripts/                    # TypeScript automation scripts (committed)
│   ├── setup.ts               # Cross-platform setup script
│   ├── start-n8n.ts           # n8n startup automation
│   ├── link-nodes.ts          # Node linking automation
│   └── health-check.ts        # Environment validation
├── config/                     # Configuration templates (committed)
│   ├── .env.template          # Environment variables template
│   └── package.json           # Local package configuration
├── docs/                       # Documentation (committed)
│   ├── README.md              # Local testing guide
│   └── TROUBLESHOOTING.md     # Common issues and solutions
├── .local/                     # Local development files (gitignored)
│   ├── n8n-data/              # n8n data directory
│   ├── n8n-custom-nodes/      # Custom nodes directory
│   ├── .env                   # Local environment variables
│   └── logs/                  # Log files
└── .gitignore                  # Ignore .local/ contents
```

#### 1.2 Node Linking Mechanism
**Strategy**: Use n8n's `N8N_CUSTOM_EXTENSIONS` environment variable to point to our built nodes.

**Process**:
1. Build nodes to `dist/` directory (existing)
2. Copy/symlink `dist/` contents to `.n8n/.local/n8n-custom-nodes/`
3. Set `N8N_CUSTOM_EXTENSIONS=.n8n/.local/n8n-custom-nodes` environment variable
4. Start n8n with custom configuration

#### 1.3 Environment Configuration
**Environment Variables**:
```bash
N8N_USER_FOLDER=.n8n/.local/n8n-data
N8N_CUSTOM_EXTENSIONS=.n8n/.local/n8n-custom-nodes
N8N_PORT=5678
N8N_HOST=localhost
N8N_PROTOCOL=http
```

### Phase 2: Build System Integration (Week 2)

#### 2.1 Package.json Script Extensions
Add new scripts to existing `package.json`:
```json
{
  "scripts": {
    "n8n:setup": "tsx .n8n/scripts/setup.ts",
    "n8n:start": "tsx .n8n/scripts/start-n8n.ts",
    "n8n:link": "tsx .n8n/scripts/link-nodes.ts",
    "n8n:health": "tsx .n8n/scripts/health-check.ts",
    "n8n": "pnpm run build && pnpm run n8n:link && pnpm run n8n:start",
    "n8n:dev": "concurrently \"pnpm run dev\" \"pnpm run n8n:watch\""
  }
}
```

#### 2.2 Automated Node Deployment
**Link Nodes Script** (`link-nodes.ts`):
- Copy built files from `dist/` to `.n8n/.local/n8n-custom-nodes/`
- Ensure proper package.json structure for n8n recognition
- Validate node and credential files exist
- Create symbolic links where appropriate
- Use Node.js fs APIs for cross-platform file operations

#### 2.3 Watch Mode Integration
**Development Workflow**:
1. `pnpm run n8n:dev` starts TypeScript watch mode
2. On file changes: rebuild → re-link → optionally restart n8n
3. Developer sees changes in local n8n instance

### Phase 3: Developer Experience (Week 3)

#### 3.1 Setup Automation
**One-Command Setup**:
```bash
pnpm run n8n:setup
```
- Creates `.n8n/.local/` directory structure
- Installs n8n locally if needed
- Sets up environment configuration
- Validates prerequisites

#### 3.2 Cross-Platform Support
**TypeScript with tsx**:
- All scripts written in TypeScript for type safety and consistency
- tsx provides cross-platform execution without compilation step
- Use Node.js built-in APIs for file system operations
- Consistent behavior across Windows, macOS, and Linux
- Leverage existing TypeScript configuration and tooling

**Path Handling**:
- Use `path.join()` and `path.resolve()` for cross-platform paths
- Handle Windows drive letters and Unix file permissions correctly
- Proper handling of symbolic links vs file copies based on platform

#### 3.3 Error Handling and Validation
**Health Checks**:
- Verify Node.js version compatibility
- Check n8n installation success
- Validate node linking worked correctly
- Test n8n startup and node availability

## File Structure Implementation

### New Files to Create

#### Configuration Files
- `.n8n/config/.env.template` - Environment variables template
- `.n8n/config/package.json` - Local package configuration
- `.n8n/.gitignore` - Ignore .local/ directory contents

#### Scripts (TypeScript with tsx)
- `.n8n/scripts/setup.ts` - Cross-platform setup script
- `.n8n/scripts/start-n8n.ts` - n8n startup automation
- `.n8n/scripts/link-nodes.ts` - Node linking automation
- `.n8n/scripts/health-check.ts` - Validate local environment

#### Documentation
- `.n8n/docs/README.md` - Comprehensive local testing guide
- `.n8n/docs/TROUBLESHOOTING.md` - Common issues and solutions

### Modified Files

#### Root Directory Updates
- `package.json` - Add local testing scripts and tsx dependency
- `.gitignore` - Ignore `.n8n/.local/` and logs
- `README.md` - Add section on local testing
- `gulpfile.js` - Optional: add local deployment task

## Success Criteria

### Functional Requirements
- ✅ **Quick Setup**: `pnpm run n8n:setup` creates working environment
- ✅ **One-Command Testing**: `pnpm run n8n` starts n8n with nodes loaded
- ✅ **Development Integration**: `pnpm run n8n:dev` enables live development
- ✅ **Node Visibility**: Both Luma and LumaTrigger nodes appear in n8n UI
- ✅ **Credential Integration**: LumaApi credentials work in local environment
- ✅ **Cross-Platform**: Works on Windows, macOS, and Linux

### Developer Experience Goals
- ⚡ **Fast Iteration**: Changes reflected in under 10 seconds
- 🔧 **Easy Debugging**: Clear error messages and logs
- 📚 **Self-Documenting**: Setup process guides developers through requirements
- 🧹 **Clean Teardown**: Easy cleanup of local testing environment
- 🔄 **Workflow Integration**: No disruption to existing development process

## Risk Mitigation

### Technical Risks
1. **n8n Version Compatibility**
   - **Risk**: Local n8n version differs from deployment target
   - **Mitigation**: Pin n8n version in local testing, document version requirements

2. **Node Loading Issues**
   - **Risk**: n8n fails to recognize or load custom nodes
   - **Mitigation**: Implement health checks, provide troubleshooting guide

3. **Cross-Platform Compatibility**
   - **Risk**: Scripts fail on different operating systems
   - **Mitigation**: Use TypeScript with tsx for consistent cross-platform execution

### Development Risks
1. **Workflow Disruption**
   - **Risk**: New local testing interferes with existing development
   - **Mitigation**: Keep local testing isolated, make it optional

2. **Setup Complexity**
   - **Risk**: Local setup too complex for new developers
   - **Mitigation**: Automate setup with TypeScript scripts, provide clear documentation

3. **TypeScript Dependencies**
   - **Risk**: Additional dependency on tsx for script execution
   - **Mitigation**: tsx is lightweight and already common in TypeScript projects

## Implementation Timeline

### Week 1: Foundation (Days 1-7)
- **Day 1-2**: Create `.n8n/` directory structure and TypeScript script templates
- **Day 3-4**: Implement node linking mechanism using `N8N_CUSTOM_EXTENSIONS`
- **Day 5-6**: Create cross-platform setup automation with tsx
- **Day 7**: Test basic n8n startup with custom nodes

### Week 2: Integration (Days 8-14)
- **Day 8-9**: Add package.json scripts for local testing workflows
- **Day 10-11**: Implement watch mode integration with auto-linking
- **Day 12-13**: Create health check and validation systems
- **Day 14**: End-to-end testing of development workflow

### Week 3: Polish (Days 15-21)
- **Day 15-16**: Comprehensive documentation and troubleshooting guides
- **Day 17-18**: Cross-platform testing and TypeScript refinements
- **Day 19-20**: Performance optimization and developer experience improvements
- **Day 21**: Final validation and documentation updates

## Acceptance Criteria

### Must Have (MVP)
- [ ] Local n8n instance starts with `pnpm run n8n`
- [ ] Built Luma nodes are available in local n8n UI
- [ ] Credentials system functions correctly
- [ ] Basic development workflow documented

### Should Have (Enhanced)
- [ ] Watch mode auto-deploys changes to local n8n
- [ ] TypeScript scripts with proper error handling and logging
- [ ] Comprehensive validation and health checks
- [ ] Integration with existing build system

### Could Have (Future)
- [ ] Hot reload without n8n restart
- [ ] Multiple n8n version testing
- [ ] Automated node functionality testing
- [ ] Performance benchmarking tools

## Next Actions

### Immediate (This Week)
1. **Create Local Directory**: Set up `.n8n/` with initial structure
2. **Research n8n Custom Nodes**: Validate `N8N_CUSTOM_EXTENSIONS` approach
3. **Prototype Linking**: Create basic node linking script
4. **Test Basic Setup**: Verify n8n can load our nodes locally

### Short Term (Next 2 Weeks)
1. **Implement Core Scripts**: Build automated setup and linking
2. **Package.json Integration**: Add local testing scripts
3. **Documentation**: Create comprehensive setup guide
4. **Cross-Platform Testing**: Ensure Windows and Unix compatibility

### Long Term (Future Iterations)
1. **Advanced Features**: Hot reload, multiple environments
2. **CI Integration**: Automated local testing in CI pipeline
3. **Community Sharing**: Share local testing approach with n8n community
4. **Template Creation**: Create reusable template for other node packages

