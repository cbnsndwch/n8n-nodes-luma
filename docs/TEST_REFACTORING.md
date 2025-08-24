# Test Structure Refactoring

This document describes the refactored test structure that organizes tests by feature instead of test type, reducing merge conflicts when multiple teams work on different features.

## New Test Organization

### Directory Structure

```
tests/
├── unit/                      # Unit tests organized by feature
│   ├── shared/
│   │   └── build-system.test.ts
│   ├── calendar/
│   │   └── operations.test.ts
│   ├── event/
│   │   └── operations.test.ts
│   ├── guest/
│   │   ├── cancel.test.ts
│   │   └── reject.test.ts
│   ├── ticket/
│   │   └── operations.test.ts
│   ├── user/
│   │   └── operations.test.ts
│   └── utility/
│       └── operations.test.ts
├── integration/               # Integration tests organized by feature
│   ├── shared/
│   │   └── node-registration.test.ts
│   ├── calendar/
│   │   └── workflow-execution.test.ts
│   ├── guest/
│   │   └── workflow-execution.test.ts
│   └── ticket/
│       └── workflow-execution.test.ts
└── frontend/                  # Frontend/UX tests organized by feature
    ├── shared/
    │   └── node-properties.test.ts
    ├── calendar/
    │   └── user-experience.test.ts
    ├── guest/
    │   └── user-experience.test.ts
    └── ticket/
        └── user-experience.test.ts
```

## Test Scripts

### General Test Scripts

```json
{
  "test": "vitest",
  "test:run": "vitest run",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest run --coverage",
  "test:unit": "vitest run tests/unit",
  "test:integration": "vitest run tests/integration",
  "test:frontend": "vitest run tests/frontend"
}
```

### Feature-Specific Test Scripts

```json
{
  "test:calendar": "vitest run tests/unit/calendar tests/integration/calendar tests/frontend/calendar",
  "test:event": "vitest run tests/unit/event tests/integration/event tests/frontend/event",
  "test:guest": "vitest run tests/unit/guest tests/integration/guest tests/frontend/guest",
  "test:ticket": "vitest run tests/unit/ticket tests/integration/ticket tests/frontend/ticket",
  "test:user": "vitest run tests/unit/user tests/integration/user tests/frontend/user",
  "test:utility": "vitest run tests/unit/utility tests/integration/utility tests/frontend/utility",
  "test:shared": "vitest run tests/unit/shared tests/integration/shared tests/frontend/shared"
}
```

## Benefits

### 1. Reduced Merge Conflicts
- **Before**: Multiple features touching the same test files (e.g., `workflow-execution.test.ts`)
- **After**: Each feature has its own test files, reducing conflicts

### 2. Feature-Aligned Development
- Tests are organized the same way as the main codebase
- Easier to find and maintain tests for specific features
- Clear ownership of test files by feature teams

### 3. Granular Test Execution
- Run tests for specific features: `pnpm test:guest`
- Run tests by type: `pnpm test:unit`
- Run all tests: `pnpm test:run`

### 4. Better Test Organization
- Unit tests focus on individual feature components
- Integration tests focus on feature workflow execution
- Frontend tests focus on feature user experience

## Migration Example

### Before (Monolithic Test File)
```typescript
// tests/unit/build-system.test.ts
describe('Build System Tests', () => {
  // Tests for all features mixed together
  describe('Ticket Operations', () => { /* ticket tests */ });
  describe('Guest Operations', () => { /* guest tests */ });
  describe('Calendar Operations', () => { /* calendar tests */ });
});
```

### After (Feature-Specific Test Files)
```typescript
// tests/unit/ticket/operations.test.ts
describe('Ticket Operations Unit Tests', () => {
  // Only ticket-related tests
});

// tests/unit/guest/cancel.test.ts
describe('Guest Cancel Operation Unit Tests', () => {
  // Only guest cancel tests
});

// tests/unit/guest/reject.test.ts
describe('Guest Reject Operation Unit Tests', () => {
  // Only guest reject tests
});
```

## Test Types by Feature

### Unit Tests
- Test individual feature components in isolation
- Validate contracts, properties, and compilation
- Check constants and interfaces

### Integration Tests
- Test feature workflow execution
- Validate parameter handling and error scenarios
- Test interaction with n8n execution context

### Frontend Tests
- Test user experience and interface
- Validate parameter display logic
- Check field labeling and conditional visibility

## Running Tests

### Run All Tests
```bash
pnpm test:run
```

### Run Tests by Type
```bash
pnpm test:unit       # All unit tests
pnpm test:integration # All integration tests
pnpm test:frontend   # All frontend tests
```

### Run Tests by Feature
```bash
pnpm test:guest      # All guest-related tests
pnpm test:ticket     # All ticket-related tests
pnpm test:calendar   # All calendar-related tests
pnpm test:shared     # All shared/core tests
```

### Run Tests with Coverage
```bash
pnpm test:coverage
```

### Run Tests in Watch Mode
```bash
pnpm test
```

## Best Practices

1. **Feature Ownership**: Each feature team is responsible for their feature's test files
2. **Consistent Naming**: Use descriptive test file names (`cancel.test.ts`, `operations.test.ts`)
3. **Test Isolation**: Keep feature tests independent and isolated
4. **Shared Utilities**: Common test utilities go in `tests/shared/`
5. **Regular Execution**: Run feature-specific tests during development

This structure ensures that teams can work independently on different features without stepping on each other's test files, significantly reducing merge conflicts and improving development velocity.
