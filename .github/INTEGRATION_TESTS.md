# Integration Tests CI Configuration

This directory contains example GitHub Actions workflow that demonstrates how to run the integration tests on pull request merge.

## Test Categories

- **Unit Tests** (`pnpm run test:unit`): Test individual components and functions
- **Integration Tests** (`pnpm run test:integration`): Test node registration and workflow execution
- **Frontend Tests** (`pnpm run test:frontend`): Test user experience and node properties
- **Coverage** (`pnpm run test:coverage`): Generate code coverage reports

## Local Development

Run all tests locally:
```bash
pnpm run test
```

Run specific test types:
```bash
pnpm run test:unit
pnpm run test:integration
pnpm run test:frontend
```

## Contributing

When adding new features:
1. Add corresponding tests in the appropriate category
2. Ensure all tests pass locally
3. Update this documentation if needed
4. Tests will run automatically on pull requests