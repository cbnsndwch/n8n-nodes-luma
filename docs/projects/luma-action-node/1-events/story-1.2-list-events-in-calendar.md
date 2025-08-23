# [PROJ_002] Story 1.2: List Events in Calendar

**Epic:** Core Event Management  
**Story ID:** 1.2  
**Priority:** High  

## User Story
**As a** workflow developer  
**I want to** retrieve a list of events from a calendar  
**So that** I can process multiple events in bulk operations

## Acceptance Criteria
- ✅ Support calendar ID input (required)
- ✅ Support filtering by event state (active, draft, past)
- ✅ Support filtering by series ID
- ✅ Support pagination with limit and cursor
- ✅ Return structured event list

## Technical Implementation
```typescript
// Resource: Event  
// Operation: List
// Parameters:
{
  calendarId: string (required),
  additionalFields: {
    eventState?: 'active' | 'draft' | 'past',
    seriesId?: string,
    limit?: number,
    after?: string, // pagination cursor
    before?: string // pagination cursor
  }
}
```

## API Endpoint
- `GET /v1/calendar/list-events` - List events in calendar

## Test Cases
- List all events in calendar
- Filter by active events only
- Filter by specific series
- Pagination works correctly
- Empty calendar returns empty array

## Definition of Done
- [ ] Calendar ID parameter validation implemented
- [ ] Event state filtering working
- [ ] Series ID filtering implemented
- [ ] Pagination with cursors working
- [ ] Unit tests written and passing
- [ ] Integration tests completed
- [ ] Documentation updated

## Dependencies
- Calendar must exist before listing events

## Estimated Effort
**Story Points:** 5  
**Time Estimate:** 6-8 hours
