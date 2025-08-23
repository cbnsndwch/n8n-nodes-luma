# [PROJ_002] Story 1.2: List Events in Calendar

**Epic:** Core Event Management  
**Story ID:** 1.2  
**Priority:** High  

## User Story
**As a** workflow developer  
**I want to** retrieve a list of events from a calendar  
**So that** I can process multiple events in bulk operations

## Acceptance Criteria
- ✅ Support calendar-based event listing (no calendar ID required)
- ✅ Support filtering by date range (before/after)
- ✅ Support sorting by start date
- ✅ Support pagination with limit and cursor
- ✅ Return structured event list

## Technical Implementation
```typescript
// Resource: Calendar  
// Operation: List Events
// Parameters:
{
  additionalFields: {
    before?: string, // ISO 8601 datetime
    after?: string, // ISO 8601 datetime
    sortDirection?: 'asc' | 'desc' | 'asc nulls last' | 'desc nulls last',
    sortColumn?: 'start_at',
    paginationCursor?: string,
    paginationLimit?: number
  }
}
```

## API Endpoint
- `GET /public/v1/calendar/list-events` - List events in calendar

## Test Cases
- List all events in calendar
- Filter by date range (before/after)
- Sort events by start date
- Pagination works correctly
- Empty calendar returns empty array

## Definition of Done
- [ ] Date range filtering implemented
- [ ] Sorting by start date working
- [ ] Pagination with cursors working
- [ ] Unit tests written and passing
- [ ] Integration tests completed
- [ ] Documentation updated

## Dependencies
- Valid API credentials for calendar access

## Estimated Effort
**Story Points:** 5  
**Time Estimate:** 6-8 hours
