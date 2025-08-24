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

4. **Run tests**: `pnpm run test`
   - Executes all unit, integration, and frontend tests with vitest
   - Takes approximately 3 seconds for full test suite (55 tests)
   - NEVER CANCEL: Set timeout to 60+ seconds for safety

5. **Full validation**: `pnpm run prepublishOnly`
   - Runs complete build + lint with strict rules
   - Takes approximately 5-8 seconds
   - NEVER CANCEL: Set timeout to 60+ seconds for safety
   - Must pass before publishing to npm

### Testing Requirements
**CRITICAL**: All new code must include comprehensive tests:

1. **Unit Tests Required** (`tests/unit/`):
   - New nodes: Test node structure, parameters, and basic functionality
   - New credentials: Test credential configuration and validation
   - New utilities: Test helper functions and core logic
   - File changes: Test build system and source file integrity

2. **Integration Tests Required** (`tests/integration/`):
   - New API endpoints: Test n8n workflow execution and data flow
   - New operations: Test parameter handling and error scenarios
   - New resources: Test node registration and n8n compatibility
   - Workflow changes: Test end-to-end execution patterns

3. **Frontend/UX Tests Required** (`tests/frontend/`):
   - New UI elements: Test parameter structure and conditional fields
   - New user flows: Test credential integration and user experience
   - Display changes: Test node properties and user-friendly configuration

### Manual Validation Requirements
**CRITICAL**: After making code changes, always validate functionality:

1. **Build and verify output**: Check that `dist/` contains expected files after build
   - Should contain: `nodes/Luma/Luma.node.js`, `credentials/LumaApi.credentials.js`, SVG icons
2. **Run automated tests**: Execute test suite to ensure no regressions
   - Use `pnpm run test` for full test suite or category-specific commands
3. **Test node structure**: Ensure credentials and nodes are properly structured
4. **Validate TypeScript**: Confirm no compilation errors in watch mode
5. **Check ESLint rules**: All n8n-specific linting rules must pass
6. **Test scenario**: If possible, test node functionality in n8n development environment

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
├── nodes/                           # Node implementations
│   ├── Luma/                       # Main action node
│   │   ├── Luma.node.ts            # Node logic and configuration
│   │   ├── luma.svg                # Node icon
│   │   ├── operations.ts           # Operation definitions
│   │   ├── {resource}/             # Resource-specific implementations
│   │   │   ├── contracts.ts        # TypeScript types and interfaces
│   │   │   ├── operations.ts       # Resource operations
│   │   │   └── props.ts            # n8n parameter definitions
│   │   └── shared/                 # Shared utilities and base classes
│   │       ├── constants.ts        # Shared constants
│   │       ├── contracts.ts        # Base types
│   │       ├── operations.base.ts  # Base operation class
│   │       ├── utils.ts            # Utility functions
│   │       ├── api/                # API client utilities
│   │       └── props/              # Shared parameter definitions
│   └── LumaTrigger/                # Trigger node implementation
│       ├── LumaTrigger.node.ts     # Trigger node logic
│       └── luma.svg                # Node icon
├── credentials/                     # API credentials configuration
│   └── LumaApi.credentials.ts       # Luma API key setup
├── docs/                           # Project documentation
│   ├── luma.openapi.yml            # OpenAPI specification
│   └── projects/                   # Project-specific documentation
│       └── {project-id}-{name}/    # Individual project folder
│           ├── PRD.md              # Product Requirements Document
│           ├── EPIC_SUMMARY.md     # Epic organization summary
│           ├── API_COVERAGE.md     # API coverage analysis
│           └── {epic-num}-{name}/  # Epic-specific documentation
│               ├── epic-{num}-{name}.md        # Epic overview
│               └── story-{num}.{sub}-{name}.md # Individual user stories
├── tests/                          # Comprehensive test suite
│   ├── unit/                       # Unit tests organized by resource
│   ├── integration/                # Integration tests organized by resource  
│   ├── frontend/                   # Frontend/UX tests organized by resource
│   └── setup.ts                    # Test configuration and utilities
├── dist/                           # Build output (generated)
├── package.json                    # Project configuration
├── tsconfig.json                   # TypeScript configuration
├── vitest.config.ts                # Test runner configuration
├── .eslintrc.js                    # ESLint rules for development
├── .eslintrc.prepublish.js         # Strict ESLint rules for publishing
├── .prettierrc.js                  # Code formatting configuration
└── gulpfile.js                     # Icon copying build step
```

### Important Implementation Files
- **Action node**: `nodes/Luma/Luma.node.ts` - Main action node with resource operations
- **Trigger node**: `nodes/LumaTrigger/LumaTrigger.node.ts` - Event polling and webhook triggers
- **Credentials**: `credentials/LumaApi.credentials.ts` - Handles API authentication
- **Entry point**: `index.ts` - Package entry point (minimal, mostly empty)
- **Test suite**: `tests/` - Comprehensive unit, integration, and frontend tests
- **Resource implementations**: `nodes/Luma/{resource}/` - Individual API resource modules
- **Shared utilities**: `nodes/Luma/shared/` - Common utilities and base classes

### Project Documentation Structure
The repository follows a structured approach to project documentation:

#### Project Organization (`docs/projects/`)
- **Naming Convention**: `{project-id}-{descriptive-name}/`
- **Required Files**:
  - `PRD.md` - Product Requirements Document with overview, scope, and acceptance criteria
  - `EPIC_SUMMARY.md` - Summary of epics and their organization
  - `API_COVERAGE.md` - Analysis of API endpoints and coverage mapping

#### Epic Organization (`docs/projects/{project}/`)
- **Naming Convention**: `{epic-num}-{resource-name}/`
- **Required Files**:
  - `epic-{num}-{name}.md` - Epic overview, scope, and user story organization
  - `story-{num}.{sub}-{name}.md` - Individual user stories with acceptance criteria

#### User Story Structure
Each user story follows a consistent format:
- **Header**: Project reference, epic, story ID, priority
- **User Story**: Standard "As a/I want to/So that" format
- **Acceptance Criteria**: Specific, testable requirements with checkboxes
- **Technical Implementation**: Code snippets, parameter definitions
- **API Endpoint**: Relevant API endpoint(s)
- **Test Cases**: Expected test scenarios
- **Definition of Done**: Completion checklist
- **Dependencies**: Prerequisite stories or epics
- **Estimated Effort**: Story points and time estimates

#### Documentation Standards
- **Consistent formatting**: Use standard markdown with code blocks for technical details
- **Traceability**: Clear mapping between stories, API endpoints, and implementation files
- **Actionable acceptance criteria**: Each criterion should be verifiable and testable
- **Complete coverage**: All API functionality should be documented before implementation
- **Cross-references**: Link related stories, dependencies, and implementation files

### GitHub Project Management Structure
Projects should be managed using GitHub Projects for enhanced tracking and collaboration:

#### Project Setup
- **GitHub Project**: Create a dedicated project for each major initiative
- **Project Naming**: "Project {ID}: {Descriptive Name}" (e.g., "Project 005: GitHub Workflows for NPM Release")
- **Project Type**: Team or Repository project with multiple views
- **Views Configuration**:
  - **Board View**: Kanban-style with columns (To Do, In Progress, In Review, Done)
  - **Table View**: All issues with custom fields for detailed tracking
  - **Roadmap View**: Timeline visualization of epics and milestones

#### Custom Fields for Projects
- **Epic**: Single select field mapping to project epics
- **Story Points**: Number field for effort estimation (1, 2, 3, 5, 8)
- **Priority**: Single select field (High, Medium, Low)
- **Sprint/Iteration**: Iteration field for sprint planning (optional)

#### Issue Structure and Hierarchy
**Epic Level Issues:**
- **Purpose**: Top-level GitHub issues representing major functional areas
- **Labels**: `epic`, `project-{id}`, functional area labels
- **Milestones**: One milestone per epic for story grouping
- **Content**: Epic overview, acceptance criteria, linked user stories
- **Task Lists**: Checkbox list of all user stories with issue references

**Story Level Issues:**
- **Purpose**: Individual GitHub issues for specific functionality
- **Labels**: `story`, `epic-{num}`, priority and type labels
- **Linking**: Referenced in parent epic's task list
- **Content**: User story format, acceptance criteria, technical details
- **Pull Request Integration**: Automatic linking via keywords

#### Issue Templates
**Epic Template Structure:**
```markdown
---
name: Epic
about: Create a new epic for the project
title: 'Epic [NUMBER]: [NAME]'
labels: epic, project-[ID]
---

## Epic Overview
[Brief description from epic documentation]

## Acceptance Criteria
- [ ] All user stories completed
- [ ] All tests passing
- [ ] Documentation updated

## User Stories
- [ ] Story [X.1]: [Name] #[issue-number]
- [ ] Story [X.2]: [Name] #[issue-number]

## Links
- [Epic Documentation](link-to-docs)
```

**Story Template Structure:**
```markdown
---
name: User Story
about: Create a new user story
title: 'Story [NUMBER]: [NAME]'
labels: story, epic-[X]
---

## User Story
As a [role], I want to [action], so that [benefit]

## Acceptance Criteria
- [ ] [Specific criterion 1]
- [ ] [Specific criterion 2]

## Definition of Done
- [ ] Code implemented and tested
- [ ] Documentation updated
- [ ] Code reviewed and approved

## Links
- Epic: #[epic-issue-number]
- [Story Documentation](link-to-story-doc)
```

#### Project Automation and Integration
- **Pull Request Integration**: PRs automatically linked to issues via keywords
- **Status Automation**: Issues move between columns based on PR status
- **Commit Integration**: Commits can close stories with "closes #issue" keywords
- **Progress Tracking**: Automatic burndown charts and velocity metrics
- **Assignment Workflow**: Clear ownership and workload distribution

#### Benefits of GitHub Projects Approach
- **Enhanced Visibility**: Multiple views (board, table, roadmap) for different stakeholders
- **Better Organization**: Proper epic/story hierarchy with clear dependencies
- **Automatic Tracking**: Progress updates based on PR and commit activity
- **Collaboration**: Clear status, assignment, and communication channels
- **Metrics**: Burndown charts, velocity tracking, and completion analytics
- **Integration**: Seamless connection between issues, PRs, and code changes

## Development Workflow

### Project Planning and Documentation
When starting a new project:

1. **Create project directory**: Follow naming convention `{project-id}-{descriptive-name}/`
2. **Write PRD**: Document project overview, current state, target state, and success criteria
3. **Analyze API coverage**: Map API endpoints to required functionality
4. **Organize into epics**: Group related functionality into logical epics
5. **Write epic summaries**: Create EPIC_SUMMARY.md with coverage statistics
6. **Document user stories**: Break epics into specific, actionable user stories
7. **Validate completeness**: Ensure 100% API coverage before implementation starts
8. **Create GitHub Project**: Set up project tracking and issue management

### GitHub Project Setup Process
**MANDATORY**: All new projects must include GitHub Project setup for tracking:

#### Project Creation Steps
1. **Create GitHub Project**: Use "Project {ID}: {Descriptive Name}" naming
2. **Configure Views**: Set up Board, Table, and Roadmap views
3. **Add Custom Fields**: Epic, Story Points, Priority, Sprint/Iteration
4. **Create Issue Templates**: Epic and Story templates in `.github/ISSUE_TEMPLATE/`
5. **Set Up Automation**: Configure status automation and PR integration

#### Issue Creation Process
1. **Create Epic Issues**: One GitHub issue per epic with milestone
2. **Create Story Issues**: Individual issues for each user story
3. **Link Issues**: Reference stories in epic task lists
4. **Apply Labels**: Consistent labeling (epic, story, project-id)
5. **Set Custom Fields**: Assign epic, story points, priority
6. **Add to Project**: Ensure all issues are added to GitHub Project

#### Project Management Workflow
- **Epic Tracking**: Use milestones to group stories by epic
- **Sprint Planning**: Organize stories into iterations if using sprints
- **Progress Monitoring**: Track completion via project views and automation
- **Status Updates**: Issues automatically move based on PR status
- **Documentation Links**: Maintain links between issues and documentation

### Documentation Requirements for New Projects
**MANDATORY**: All new projects must include complete documentation before implementation:

#### Project Root Files (`docs/projects/{project}/`)
- **PRD.md**: Complete product requirements with scope and acceptance criteria
- **EPIC_SUMMARY.md**: Epic organization with coverage statistics
- **API_COVERAGE.md**: Mapping of API endpoints to implementation plans

#### Epic Documentation (`docs/projects/{project}/{epic}/`)
- **epic-{num}-{name}.md**: Epic overview with scope and story organization
- **story-{num}.{sub}-{name}.md**: Individual user stories with complete specifications

#### Story Documentation Standards
Each user story must include:
- Clear user story in standard format
- Specific, testable acceptance criteria
- Technical implementation details with code snippets
- API endpoint mapping
- Test case specifications
- Definition of done checklist
- Dependency analysis
- Effort estimation

### Making Changes to Nodes
1. **Always start with build validation**: Run `pnpm run build` to ensure current state works
2. **Use watch mode for development**: `pnpm run dev` for automatic recompilation
3. **Edit node files**: Modify files in `nodes/Luma/` directory
4. **Write tests for changes**: Add unit, integration, and frontend tests as appropriate
5. **Test TypeScript compilation**: Watch for errors in dev mode output
6. **Validate with lint**: Run `pnpm run lint` frequently during development
7. **Run test suite**: Execute `pnpm run test` to ensure no regressions
8. **Format before committing**: Always run `pnpm run format`

### Adding New Operations or Resources
- Edit `nodes/Luma/Luma.node.ts` to add new resources or operations
- Follow n8n node development patterns for parameter definitions
- Ensure proper TypeScript types are used
- Add appropriate display options and validation
- **Write comprehensive tests**: Create unit tests for node structure, integration tests for workflow execution, and frontend tests for user experience
- **Test all scenarios**: Include both success and error cases in test coverage

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
pnpm run format && pnpm run lint && pnpm run test  # After making changes

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
tests/
tsconfig.json
vitest.config.ts
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
  "prepublishOnly": "pnpm run build && pnpm run lint -c .eslintrc.prepublish.js nodes credentials package.json",
  "test": "vitest",
  "test:run": "vitest run",
  "test:coverage": "vitest run --coverage",
  "test:unit": "vitest run tests/unit",
  "test:integration": "vitest run tests/integration",
  "test:frontend": "vitest run tests/frontend"
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

### Comprehensive Test Suite
The repository includes a comprehensive test suite using **vitest** with 55 tests across three categories:

- **Unit Tests** (16 tests): Build system validation, source file verification, development workflow testing
- **Integration Tests** (26 tests): Node registration, workflow execution, parameter handling, error scenarios
- **Frontend/UX Tests** (13 tests): Node properties, parameter structure, user experience validation

### Test Execution Commands
```bash
# Run all tests (55 tests, ~3 seconds)
pnpm run test

# Run tests by category
pnpm run test:unit         # Unit tests only
pnpm run test:integration  # Integration tests only  
pnpm run test:frontend     # Frontend/UX tests only

# Run tests with coverage report
pnpm run test:coverage

# Run tests in watch mode (for development)
pnpm run test:ui          # Interactive UI mode
```

### Test Requirements for New Code
**MANDATORY**: All new code changes must include appropriate tests:

#### Unit Tests (`tests/unit/`)
- **Required for**: New nodes, credentials, utilities, build system changes
- **Test patterns**: File existence, TypeScript compilation, dependency integrity
- **Examples**: Build system validation, source file verification, configuration testing

#### Integration Tests (`tests/integration/`)
- **Required for**: New API operations, workflow changes, n8n compatibility features
- **Test patterns**: Node registration, workflow execution, parameter validation, error handling
- **Examples**: n8n node registration, workflow data flow, API integration, error scenarios

#### Frontend/UX Tests (`tests/frontend/`)
- **Required for**: UI parameter changes, credential flows, user experience modifications
- **Test patterns**: Parameter structure, conditional fields, user-friendly configuration
- **Examples**: Node properties validation, credential UX, parameter hierarchy testing

### Testing Guidelines
1. **Follow existing patterns**: Use established test utilities and structure from `tests/setup.ts`
2. **Test both success and failure cases**: Include error handling and edge case validation
3. **Keep tests fast**: All tests should complete in under 5 seconds total
4. **Use descriptive test names**: Tests should clearly describe what they validate
5. **Mock external dependencies**: Use vitest mocking for API calls and external services

### Validation Checklist
Before completing any changes:
- [ ] `pnpm run build` succeeds without errors
- [ ] `pnpm run test` passes all tests (55/55)
- [ ] `pnpm run lint` passes all checks  
- [ ] `pnpm run format` applied to all modified files
- [ ] `pnpm run prepublishOnly` completes successfully
- [ ] New code includes appropriate unit, integration, and/or frontend tests
- [ ] Test coverage maintained or improved for modified areas

**NEVER CANCEL long-running commands** - builds and validation steps must complete fully.

---

## Summary
This n8n community node package is well-structured and fast to build/test. All development commands are reliable and execute quickly (under 5 seconds each). The main development workflow involves: install dependencies → build → make changes in watch mode → write tests → format/lint/test → validate with prepublishOnly. The package follows n8n community standards, includes comprehensive ESLint rules for maintaining code quality, and features a robust test suite with 55 tests covering unit, integration, and frontend scenarios.