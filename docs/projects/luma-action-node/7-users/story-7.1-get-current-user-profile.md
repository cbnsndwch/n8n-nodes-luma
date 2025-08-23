# Story 7.1: Get Current User Profile

**As a** workflow developer  
**I want to** retrieve the authenticated user's profile information  
**So that** I can access their account details and preferences

## Acceptance Criteria
- ✅ Return complete user profile for authenticated user
- ✅ Include account status and verification information
- ✅ Include subscription and billing details if applicable
- ✅ Support different levels of detail inclusion

## Technical Implementation
```typescript
// Resource: User
// Operation: Get Profile
// Parameters:
{
  additionalFields: {
    includeSettings?: boolean,
    includeSubscription?: boolean,
    includeActivitySummary?: boolean,
    includeCalendarStats?: boolean,
    includeNotificationCounts?: boolean,
    includeVerificationStatus?: boolean,
    includeApiUsage?: boolean, // for API key users
    includeConnectedApps?: boolean
  }
}
```

## Test Cases
- Get basic user profile information
- Include detailed settings and preferences
- Include subscription and billing status
- Include activity summary and statistics
- Handle different authentication states
- Verify data privacy compliance

## Related Endpoints
- `GET /v1/user/me` - Get current user profile

## Dependencies
- Authentication system
- User profile service
- Privacy controls

## Definition of Done
- [ ] Implementation completed
- [ ] Unit tests written and passing
- [ ] Integration tests completed
- [ ] Documentation updated
- [ ] Code review completed
- [ ] Privacy compliance verified
