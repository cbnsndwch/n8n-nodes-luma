# [PROJ_005] Story 1.4: Code Quality Checks

**Epic:** Continuous Integration Setup  
**Story ID:** 1.4  
**Priority:** High  

## User Story
**As a** repository maintainer  
**I want to** have code quality validated automatically using ESLint with prepublish rules  
**So that** code quality standards are enforced before merging and publishing

## Acceptance Criteria
- ✅ ESLint validation runs with prepublish configuration
- ✅ Code quality failures cause CI workflow failure
- ✅ Clear error reporting for linting issues
- ✅ Both development and prepublish rules are validated
- ✅ Formatting validation included
- ✅ n8n-specific community package rules enforced
- ✅ Actionable error messages for developers

## Technical Implementation
```yaml
# Addition to .github/workflows/ci.yml
- name: Lint code (development rules)
  run: pnpm run lint

- name: Format check
  run: pnpm run format --check

- name: Lint code (prepublish rules)  
  run: pnpm run lint -c .eslintrc.prepublish.js nodes credentials package.json
```

## ESLint Configuration Coverage
The CI will validate code using both configurations:

### Development Rules (`.eslintrc.js`)
- Standard n8n community package rules
- TypeScript-specific validations
- Code quality and best practices
- Consistency checks

### Prepublish Rules (`.eslintrc.prepublish.js`)
- Stricter validation for publishing
- Additional quality gates
- Enhanced security checks
- Publication-ready code standards

## Code Quality Validations
### TypeScript Quality
- Type safety validations
- Proper import/export usage
- No unused variables or imports
- Consistent coding patterns

### n8n-Specific Rules
- Node structure validation
- Credential configuration compliance
- Parameter definition standards
- Display options best practices

### Security Validations
- No hardcoded secrets or tokens
- Proper error handling patterns
- Input validation compliance
- Safe API usage patterns

## Test Cases
- Properly formatted code passes all checks
- ESLint rule violations cause workflow failure
- Formatting issues are detected and reported
- Different rule sets (dev vs prepublish) are applied correctly
- Clear error messages guide developers to fixes
- Auto-fixable issues are identified
- Non-fixable issues provide clear guidance

## Definition of Done
- [ ] ESLint runs with development configuration
- [ ] ESLint runs with prepublish configuration
- [ ] Code formatting validation works
- [ ] Linting failures cause CI workflow failure
- [ ] Clear, actionable error messages provided
- [ ] Both nodes/ and credentials/ directories validated
- [ ] Package.json linting included
- [ ] Performance is reasonable (<30 seconds)

## Dependencies
- **Story 1.1**: Basic CI workflow setup must be complete
- **ESLint Configurations**: Both `.eslintrc.js` and `.eslintrc.prepublish.js` must be stable
- **Build System**: Code quality checks should run after successful build

## Error Handling
### Linting Errors
```bash
# Example error output format
❌ ESLint found 3 errors:
  
  nodes/Luma/Luma.node.ts:45:12
  Error: 'variableName' is defined but never used (no-unused-vars)
  
  credentials/LumaApi.credentials.ts:23:8  
  Error: Missing semicolon (semi)
  
  Fix suggestions:
  - Remove unused variable 'variableName'
  - Add semicolon at line 23
```

### Formatting Errors
```bash
# Example formatting error output
❌ Prettier found formatting issues:
  
  nodes/Luma/event/operations.ts
  - Line 15: Expected 2 spaces, found 4
  - Line 32: Missing trailing comma
  
  Fix with: pnpm run format
```

## Performance Optimization
- **Incremental Linting**: Only lint changed files when possible
- **Parallel Execution**: Run different lint checks in parallel
- **Caching**: Leverage ESLint caching for improved performance
- **Targeted Validation**: Focus on modified files in PRs

## Integration with Development Workflow
### Local Development
- Developers can run same checks locally
- Pre-commit hooks could run lighter validation
- IDE integration provides real-time feedback
- Auto-fix capabilities for simple issues

### CI Integration
- Consistent validation regardless of local setup
- Comprehensive validation before merge
- Clear feedback in PR status checks
- Links to specific line numbers for errors

## Validation Plan
### Pre-Implementation
- [ ] Verify ESLint configurations work correctly locally
- [ ] Test both development and prepublish rule sets
- [ ] Check formatting validation accuracy
- [ ] Review error message clarity

### Implementation Testing
- [ ] Test with clean code (should pass)
- [ ] Test with linting errors (should fail)
- [ ] Test with formatting issues (should fail)
- [ ] Verify error message quality and actionability
- [ ] Test performance with large codebase

### Post-Implementation
- [ ] Monitor linting performance and reliability
- [ ] Track most common linting issues
- [ ] Gather developer feedback on error clarity
- [ ] Optimize rules based on actual usage

## Security Considerations
- **No Sensitive Data**: Ensure no tokens or secrets in validation
- **Safe Rule Sets**: Use trusted ESLint rules and configurations
- **Code Injection**: ESLint configuration files are secure
- **Error Output**: No sensitive information in error messages

## Expected CI Output
```
✓ ESLint (development): 0 errors, 0 warnings
✓ Prettier formatting: All files properly formatted
✓ ESLint (prepublish): 0 errors, 0 warnings  
✓ Code quality validation: ~20 seconds
```

## Common Issues and Solutions
### Performance Issues
- Large codebase causing slow linting
- Solution: Use ESLint caching and incremental validation

### Rule Conflicts
- Development vs prepublish rule conflicts
- Solution: Align rule sets and document differences

### Developer Experience
- Unclear error messages or difficult fixes
- Solution: Customize rule messages and provide fix suggestions

## Auto-Fix Integration
```yaml
# Optional: Auto-fix step for future enhancement
- name: Auto-fix linting issues
  run: pnpm run lintfix
  continue-on-error: true
```

## Estimated Effort
**Story Points:** 2  
**Time Estimate:** 1-2 hours
