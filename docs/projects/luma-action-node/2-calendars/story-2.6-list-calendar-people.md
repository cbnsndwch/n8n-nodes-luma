# [PROJ_002] Story 2.6: List Calendar People

## User Story
**As a** workflow developer  
**I want to** retrieve all people associated with a calendar  
**So that** I can manage attendee relationships and communications

## Acceptance Criteria
- ✅ Support calendar ID input (required)
- ✅ Return list of people with contact details
- ✅ Support filtering by role/status
- ✅ Include relationship metadata (join date, activity)

## Technical Implementation
```typescript
// Resource: Calendar
// Operation: List People
// Parameters:
{
  calendarId: string (required),
  additionalFields: {
    role?: 'admin' | 'member' | 'follower',
    status?: 'active' | 'inactive',
    includeActivity?: boolean,
    limit?: number,
    after?: string
  }
}
```

## Test Cases
- List all people in calendar
- Filter by role type
- Filter by status
- Include activity data
- Pagination works correctly

## API Endpoint
- `GET /v1/calendar/list-people`

## Priority
Medium

## Story Points
4

## Epic
[Epic 2: Calendar Operations](./epic.md)
