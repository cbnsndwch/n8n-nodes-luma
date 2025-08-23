# Story 6.3: Get Person Details

**As a** workflow developer  
**I want to** retrieve detailed information about a specific person  
**So that** I can access their complete profile and history

## Epic Reference
This story is part of [Epic 6: People Management](./epic.md)

## Acceptance Criteria
- ✅ Support person ID input (required)
- ✅ Return complete profile information
- ✅ Include event participation history
- ✅ Include engagement metrics and analytics

## Technical Implementation
```typescript
// Resource: People
// Operation: Get Person
// Parameters:
{
  personId: string (required),
  additionalFields: {
    includeEventHistory?: boolean,
    includeEngagementMetrics?: boolean,
    includeContactPreferences?: boolean,
    includeSocialProfiles?: boolean,
    includeCustomFields?: boolean,
    includeTagHistory?: boolean,
    maxEventHistory?: number, // limit historical events
    eventHistoryFrom?: string // date filter for history
  }
}
```

## API Endpoint
- `GET /v1/person/get`

## Test Cases
- Valid person ID returns complete profile
- Invalid person ID returns appropriate error
- Event history included when requested
- Engagement metrics calculated correctly
- Contact preferences accessible
- Tag history properly formatted

## Priority
High

## Story Points
3

## Dependencies
- Person must exist
- Proper authentication and permissions

## Definition of Done
- [ ] Implementation follows n8n node patterns
- [ ] Input validation and error handling
- [ ] TypeScript interfaces defined
- [ ] Unit tests written and passing
- [ ] Integration tests with real API
- [ ] Documentation updated
