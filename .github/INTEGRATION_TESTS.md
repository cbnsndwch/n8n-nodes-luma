# Integration Tests CI Configuration

This directory contains example GitHub Actions workflow that demonstrates how to run the integration tests on pull request merge.

## Example Workflow

Create `.github/workflows/integration-tests.yml`:

```yaml
name: Integration Tests

on:
  pull_request:
    branches: [ main, develop ]
  push:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [20.x, 22.x]
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 10.15.0
        
    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'pnpm'
        
    - name: Install dependencies
      run: pnpm install
      
    - name: Build project
      run: pnpm run build
      
    - name: Run linting
      run: pnpm run lint
      
    - name: Run unit tests
      run: pnpm run test:unit
      
    - name: Run integration tests
      run: pnpm run test:integration
      
    - name: Run frontend tests
      run: pnpm run test:frontend
      
    - name: Generate coverage report
      run: pnpm run test:coverage
      
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        fail_ci_if_error: false
```

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