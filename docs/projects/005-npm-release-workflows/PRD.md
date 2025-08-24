# GitHub Workflows for NPM Release - Product Requirements Document (PRD)

## Overview

This PRD defines the implementation requirements for automated GitHub workflows that handle the release and publishing of the n8n-nodes-luma package to the npm registry, including version management, quality assurance, and automated release processes.

## Current State

✅ **Completed:**
- Package structure with proper build system
- Comprehensive test suite (55 tests across unit/integration/frontend)
- ESLint configuration with prepublish validation
- Manual release process via `pnpm run prepublishOnly`
- Package.json configured for npm publishing

❌ **Missing:**
- Automated GitHub workflows for CI/CD
- Automated npm publishing on releases
- Version management and tagging
- Release notes generation
- Security and quality gates

## Target State

📋 **To Be Implemented:**
- **Continuous Integration (CI)**: Automated testing on PRs and pushes
- **Release Workflow**: Automated npm publishing on GitHub releases
- **Version Management**: Semantic versioning with automated tagging
- **Quality Gates**: Build, test, and lint validation before publishing
- **Security**: npm token management and secure publishing
- **Documentation**: Release notes and changelog generation

## Business Requirements

### Primary Goals
1. **Automated Publishing**: Eliminate manual npm publishing steps
2. **Quality Assurance**: Ensure all releases pass comprehensive validation
3. **Version Management**: Automated semantic versioning and git tagging
4. **Security**: Secure token management for npm publishing
5. **Transparency**: Clear release notes and changelog generation

### Success Criteria
- ✅ All PRs automatically validated with CI workflow
- ✅ GitHub releases automatically publish to npm
- ✅ Version bumps handled automatically with proper git tags
- ✅ Release process takes <5 minutes from tag to npm availability
- ✅ Zero manual intervention required for standard releases
- ✅ Clear rollback process for failed releases

## Technical Requirements

### GitHub Workflows Needed

#### 1. Continuous Integration (CI) Workflow
- **Trigger**: PRs and pushes to main branch
- **Purpose**: Validate code quality and functionality
- **Steps**: Install deps → Build → Lint → Test → Coverage reporting

#### 2. Release Workflow  
- **Trigger**: GitHub release creation/publication
- **Purpose**: Automated npm publishing
- **Steps**: Validate → Build → Test → Publish to npm → Update changelog

#### 3. Version Bump Workflow (Optional)
- **Trigger**: Manual dispatch or PR merge with version labels
- **Purpose**: Automated version management
- **Steps**: Version bump → Git tag → Create GitHub release

### Security Requirements
- **npm Token**: Secure storage in GitHub Secrets
- **Permissions**: Minimal required permissions for workflows
- **Validation**: Verify package contents before publishing
- **Audit**: npm audit integration for dependency security

### Quality Gates
- **Build Validation**: TypeScript compilation must succeed
- **Test Coverage**: All 55 tests must pass
- **Lint Validation**: ESLint prepublish rules must pass
- **Package Integrity**: Verify dist/ contents match expectations

## Epic Structure

The implementation is organized into 3 main epics:

### Epic 1: Continuous Integration Setup (`1-ci-workflow/`)
**Focus:** Automated testing and validation on PRs  
**Key Components:** CI workflow, test reporting, build validation  
**Estimated Effort:** 8-12 hours

### Epic 2: Release Automation (`2-release-workflow/`)  
**Focus:** Automated npm publishing on GitHub releases  
**Key Components:** Release workflow, npm publishing, security setup  
**Estimated Effort:** 12-16 hours

### Epic 3: Version Management (`3-version-management/`)
**Focus:** Automated versioning and changelog generation  
**Key Components:** Version bumping, git tagging, release notes  
**Estimated Effort:** 6-10 hours

## Implementation Plan

### Phase 1: CI Foundation (Epic 1)
1. Create basic CI workflow for PR validation
2. Set up test reporting and coverage
3. Configure build artifact validation
4. Test workflow on feature branches

### Phase 2: Release Automation (Epic 2)  
1. Configure npm token and security
2. Create release workflow with publishing
3. Implement quality gates and validation
4. Test with beta releases

### Phase 3: Version Management (Epic 3)
1. Set up automated version bumping
2. Configure git tagging and release creation
3. Implement changelog generation
4. Create rollback procedures

## Dependencies

### External Dependencies
- **GitHub Actions**: Available workflows and marketplace actions
- **npm Registry**: Access and publishing permissions
- **Package Registry**: Potential future migration considerations

### Internal Dependencies  
- **Package Structure**: Current build system must remain stable
- **Test Suite**: All existing tests must continue passing
- **Build Process**: Current pnpm/gulp build process compatibility

## Risk Assessment

### High Risk
- **npm Token Security**: Compromise could allow malicious publishing
- **Build System Changes**: Could break existing development workflow
- **Version Conflicts**: Automated versioning might conflict with manual changes

### Medium Risk  
- **GitHub Actions Limits**: Workflow execution time and frequency limits
- **Dependencies**: Changes to build tools could break workflows
- **Testing**: Comprehensive testing required in non-production environment

### Low Risk
- **Documentation**: Workflow documentation maintenance overhead
- **Performance**: Minimal impact on development workflow performance

## Acceptance Criteria

### Epic 1: CI Workflow
- [ ] CI workflow runs on all PRs and main branch pushes
- [ ] All 55 tests execute and must pass for workflow success
- [ ] Build artifacts are validated for completeness
- [ ] Workflow completes in <3 minutes
- [ ] Clear status reporting in PR checks

### Epic 2: Release Workflow
- [ ] GitHub release triggers automated npm publishing
- [ ] npm package is published with correct version and contents
- [ ] Quality gates prevent publishing of broken packages
- [ ] Secure token management with no exposure in logs
- [ ] Rollback process documented and tested

### Epic 3: Version Management  
- [ ] Automated version bumping based on semantic versioning
- [ ] Git tags created automatically with releases
- [ ] Changelog generated and updated automatically
- [ ] Release notes include relevant changes and migration notes
- [ ] Manual override capabilities for emergency releases

## Validation Plan

### Pre-Implementation Testing
1. **Fork Testing**: Test workflows in personal fork before main repo
2. **Beta Releases**: Use beta/alpha tags for testing publishing
3. **Dry Run Mode**: Implement dry-run capabilities for validation

### Post-Implementation Validation
1. **CI Validation**: Create test PRs to validate CI workflow
2. **Release Testing**: Create test releases to validate publishing
3. **Security Audit**: Verify no sensitive information in logs
4. **Performance Testing**: Measure workflow execution times
5. **Rollback Testing**: Test rollback procedures with test versions

## Documentation Requirements

### User Documentation
- **README Updates**: Document new release process
- **Contributing Guide**: Update with CI/workflow information
- **Release Process**: Step-by-step guide for maintainers

### Technical Documentation  
- **Workflow Documentation**: Detailed explanation of each workflow
- **Security Guide**: Token management and security best practices
- **Troubleshooting**: Common issues and resolution steps
- **Rollback Procedures**: Emergency rollback process documentation

## Success Metrics

### Automation Metrics
- **CI Success Rate**: >95% of CI workflows should pass on first run
- **Release Time**: <5 minutes from GitHub release to npm availability  
- **Manual Intervention**: <10% of releases require manual intervention

### Quality Metrics
- **Test Coverage**: Maintain 100% test execution in CI
- **Build Success**: 100% of successful CI builds should be publishable
- **Security**: Zero security incidents related to npm publishing

### Developer Experience Metrics
- **Workflow Feedback**: <2 minutes for CI status on PRs
- **Release Frequency**: Enable faster, more frequent releases
- **Error Resolution**: Clear error messages and resolution paths

---

## Project Timeline

**Total Estimated Effort:** 26-38 hours  
**Recommended Timeline:** 2-3 weeks  
**Critical Path:** Epic 1 → Epic 2 → Epic 3 (sequential implementation recommended)

**Milestone 1 (Week 1):** Complete Epic 1 - CI workflow functional  
**Milestone 2 (Week 2):** Complete Epic 2 - Release automation working  
**Milestone 3 (Week 3):** Complete Epic 3 - Version management automated
