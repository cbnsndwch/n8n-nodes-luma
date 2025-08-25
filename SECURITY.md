# Security Policy and Vulnerability Scanning

This document describes the security scanning and vulnerability management for the n8n-nodes-luma package.

## Security Scanning Overview

The package implements automated security scanning in both CI and Release workflows:

### CI Workflow (Advisory Mode)
- **Purpose**: Early detection of security issues during development
- **Scope**: Moderate and above vulnerabilities 
- **Behavior**: Reports issues but doesn't fail the workflow
- **Triggers**: All pull requests and pushes to main branch

### Release Workflow (Blocking Mode)
- **Purpose**: Prevent vulnerable packages from being published
- **Scope**: High and critical vulnerabilities
- **Behavior**: Blocks release if critical issues are found
- **Triggers**: Tag creation (v*.*.*)

## Security Checks Performed

### 1. Dependency Audit (`pnpm audit`)
- Scans all dependencies for known security vulnerabilities
- Uses npm security advisory database
- Configurable severity levels (low, moderate, high, critical)

### 2. License Compliance Check
- Validates all dependency licenses against approved list
- Ensures no GPL or other restrictive licenses
- Special allowance for n8n-workflow (Sustainable Use License)

### 3. Package Integrity Validation
- Checks for suspicious package names or content
- Validates dependency sources
- Basic malicious package detection

## Security Policy Configuration

The security policy is defined in `.security-policy.json`:

```json
{
  "auditLevel": "high",
  "failOnVulnerabilities": true,
  "failOnLicenseViolations": true,
  "allowedLicenses": [
    "MIT", "Apache-2.0", "BSD", "BSD-2-Clause", 
    "BSD-3-Clause", "ISC", "CC0-1.0", "Unlicense"
  ]
}
```

### Allowed Licenses
- **MIT**: Most permissive, widely used
- **Apache-2.0**: Apache Software Foundation license
- **BSD variants**: Berkeley Software Distribution licenses
- **ISC**: Internet Systems Consortium license
- **CC0-1.0**: Creative Commons public domain
- **Unlicense**: Public domain dedication
- **n8n Sustainable Use License**: Required for n8n-workflow dependency

## Available Security Commands

### Manual Security Checks
```bash
# Run security audit only
pnpm run security:audit

# Run license compliance check only  
pnpm run security:license

# Run complete security check
pnpm run security:check

# Fix security issues automatically (when possible)
pnpm run security:audit:fix
```

### Security-Enhanced Build
```bash
# Build with security pre-check
pnpm run prepublish
```

## Security Violation Response

### High/Critical Vulnerabilities
1. **Immediate**: Release workflow blocked
2. **Resolution**: Update dependencies or add to ignore list
3. **Documentation**: Update security policy if needed

### License Violations
1. **Immediate**: Release workflow blocked
2. **Resolution**: Remove package or update license policy
3. **Review**: Legal review for non-standard licenses

### Advisory Warnings (CI)
1. **Tracking**: Monitor in CI logs
2. **Planning**: Schedule updates in next release cycle
3. **Documentation**: Update known issues list

## Ignoring Vulnerabilities

For false positives or accepted risks, vulnerabilities can be ignored by:

1. **Adding to security policy**:
   ```json
   "ignoredVulnerabilities": ["CVE-XXXX-EXAMPLE"] // Example CVE, replace with real CVE as needed
   ```

## Security Workflow Results

### Successful Security Scan
```
✅ Security audit passed - no high or critical vulnerabilities found
✅ License compliance check passed
✅ Dependency security validation passed
```

### Failed Security Scan
```
❌ Security audit found high or critical vulnerabilities
🚫 Release blocked due to security vulnerabilities
```

## Maintenance

- **Monthly**: Review and update allowed licenses
- **Weekly**: Check for new vulnerability disclosures
- **Per Release**: Validate security scan results
- **As Needed**: Update security policy configuration

## Resources

- [npm audit documentation](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [pnpm audit documentation](https://pnpm.io/cli/audit)
- [SPDX License List](https://spdx.org/licenses/)
- [n8n Sustainable Use License](https://github.com/n8n-io/n8n/blob/master/LICENSE.md)