# Story 6.1: List Calendar People

**As a** workflow developer  
**I want to** retrieve all people associated with a calendar  
**So that** I can manage community membership and engagement

## Epic Reference
This story is part of [Epic 6: People Management](./epic.md)

## Acceptance Criteria
- ✅ Support calendar ID input (required)
- ✅ Return list of people with basic profile information
- ✅ Support filtering by engagement level and status
- ✅ Include participation statistics for each person

## Technical Implementation
```typescript
// Resource: People
// Operation: List Calendar People
// Parameters:
{
  calendarId: string (required),
  additionalFields: {
    // Filtering Options
    engagementLevel?: 'high' | 'medium' | 'low' | 'inactive',
    status?: 'active' | 'inactive' | 'blocked',
    joinedSince?: string, // ISO 8601
    lastActivitySince?: string,
    hasAttendedEvents?: boolean,
    
    // Include Options
    includeStats?: boolean,
    includeContactInfo?: boolean,
    includeTags?: boolean,
    includeRecentActivity?: boolean,
    
    // Sorting & Pagination
    sortBy?: 'joined_at' | 'last_activity' | 'event_count' | 'engagement_score',
    sortOrder?: 'asc' | 'desc',
    page?: number,
    limit?: number
  }
}
```

## API Endpoint
- `GET /v1/calendar/people/list`

## Test Cases
- List all calendar people with basic info
- Filter by engagement levels
- Filter by activity timeframes
- Include detailed statistics
- Sort by different criteria
- Handle pagination for large lists

## Priority
High

## Story Points
5

## Dependencies
- Calendar must exist
- Proper authentication and permissions

## Definition of Done
- [ ] Implementation follows n8n node patterns
- [ ] Input validation and error handling
- [ ] TypeScript interfaces defined
- [ ] Unit tests written and passing
- [ ] Integration tests with real API
- [ ] Documentation updated
