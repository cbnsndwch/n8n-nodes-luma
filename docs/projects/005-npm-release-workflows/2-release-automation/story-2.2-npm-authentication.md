# [PROJ_005] Story 2.2: npm Authentication Configuration

**Epic:** Release Automation  
**Story ID:** 2.2  
**Priority:** High  

## User Story
As a maintainer, I want to securely configure npm authentication, so that the release workflow can publish packages without exposing credentials.

## Acceptance Criteria
- [x] npm authentication token stored securely in GitHub Secrets
- [x] Token has appropriate publishing permissions for package scope
- [x] Release workflow can authenticate with npm registry
- [x] Token permissions are minimal (package-specific, time-limited if possible)
- [x] Token validation integrated into workflow
- [x] Clear error messages for authentication failures
- [x] Documentation for token setup and rotation

## Technical Implementation

### GitHub Secrets Configuration
The NPM_TOKEN is stored securely in GitHub repository secrets and used in the release workflow:

```yaml
- name: Validate npm authentication
  run: |
    echo "🔐 Validating npm authentication..."
    if [ -z "$NODE_AUTH_TOKEN" ]; then
      echo "❌ NPM_TOKEN secret is not set..."
      exit 1
    fi
    npm whoami || {
      echo "❌ npm authentication failed..."
      exit 1
    }
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

- name: Publish to npm
  run: pnpm publish --access public
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### npm Token Setup Process

#### 1. Generate npm Token
```bash
# Login to npm (if not already logged in)
npm login

# Create an automation token with publish permissions
npm token create --read-only=false --cidr-whitelist=0.0.0.0/0
```

#### 2. Configure GitHub Secrets
1. Go to repository **Settings > Secrets and Variables > Actions**
2. Click **New repository secret**
3. Name: `NPM_TOKEN`
4. Value: The token generated from npm
5. Click **Add secret**

### Token Security Best Practices

#### Minimal Permissions
- **Scope**: Package-specific publish permissions only
- **Type**: Automation token (not classic token)
- **Access**: Write access to packages only (no user account access)
- **CIDR**: Unrestricted (GitHub Actions IPs change frequently)

#### Token Rotation Process
1. **Generate new token** using the same process above
2. **Update GitHub Secret** with the new token value
3. **Test workflow** on a branch to verify authentication
4. **Revoke old token** from npm settings
5. **Document rotation date** for tracking

### Authentication Validation

The workflow includes comprehensive authentication validation:

```bash
# Check if token is set
if [ -z "$NODE_AUTH_TOKEN" ]; then
  echo "❌ NPM_TOKEN secret is not set"
  exit 1
fi

# Validate authentication
npm whoami || {
  echo "❌ npm authentication failed"
  echo "💡 Token may be invalid or expired"
  exit 1
}
```

### Error Handling

Authentication failures provide clear guidance:

```bash
echo "💡 Please verify your npm token has the following permissions:"
echo "   - Read and write access to packages"
echo "   - Automation scope (if available)"
echo "💡 Generate a new token at: https://www.npmjs.com/settings/tokens"
echo "💡 Then update the NPM_TOKEN secret in repository settings"
```

## API Endpoint
- **npm Registry API**: Authentication and token validation
- **GitHub Secrets API**: Secure credential storage

## Test Cases
- [x] Valid npm token allows successful publishing
- [x] Invalid npm token fails with clear error message
- [x] Missing npm token fails gracefully
- [x] Token with insufficient permissions fails appropriately
- [x] Authentication validation before publishing
- [x] Clear troubleshooting guidance in errors

## Definition of Done
- [x] npm token generated with appropriate permissions
- [x] Token stored securely in GitHub Secrets as NPM_TOKEN
- [x] Release workflow configured to use token
- [x] Token validation tested in workflow
- [x] Authentication failure scenarios tested
- [x] Documentation created for token management
- [x] Token rotation process documented
- [x] Code reviewed and approved

## Dependencies
- **Story 2.1**: Release workflow must exist to test authentication
- **npm Account**: Valid npm account with publishing permissions

## Security Considerations

### Token Protection
- Never log token values in workflow output
- Use GitHub Secrets for secure storage
- Limit token scope to minimum required permissions
- Regular token rotation (quarterly recommended)

### Access Control
- Repository secrets accessible only to repository maintainers
- Workflow runs in secure GitHub Actions environment
- Token only exposed to publish steps via environment variables

### Monitoring
- Monitor npm package publishing activity
- Review GitHub Actions workflow logs for authentication issues
- Track token usage and rotation dates

## Troubleshooting Guide

### Common Issues

**Authentication Failed**
```bash
# Check token validity
npm whoami
# If fails, generate new token and update secret
```

**Permission Denied**
```bash
# Check package permissions
npm access list packages
# Ensure user has write access to package scope
```

**Version Already Exists**
```bash
# Check existing versions
npm view @cbnsndwch/n8n-nodes-luma versions --json
# Ensure version in package.json is incremented
```

## Estimated Effort
**Story Points:** 2  
**Time Estimate:** 1-2 hours  
**Complexity:** Medium - requires external account setup and security configuration

## Links
- Epic: #124
- [npm Token Documentation](https://docs.npmjs.com/about-access-tokens)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)