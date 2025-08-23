# Story 6.5: Get Person Event History

**As a** workflow developer  
**I want to** retrieve a person's complete event participation history  
**So that** I can analyze engagement patterns and preferences

## Epic Reference
This story is part of [Epic 6: People Management](./epic.md)

## Acceptance Criteria
- ✅ Support person ID input (required)
- ✅ Return chronological event participation
- ✅ Include attendance details and outcomes
- ✅ Support filtering by date ranges and event types

## Technical Implementation
```typescript
// Resource: People
// Operation: Get Event History
// Parameters:
{
  personId: string (required),
  additionalFields: {
    // Date Filtering
    dateFrom?: string, // ISO 8601
    dateTo?: string,
    
    // Event Filtering
    eventStatus?: 'upcoming' | 'past' | 'all',
    participationType?: 'attended' | 'registered' | 'interested' | 'declined',
    calendarId?: string, // specific calendar only
    eventType?: string,
    
    // Include Options
    includeEventDetails?: boolean,
    includeTicketInfo?: boolean,
    includeNetworking?: boolean, // connections made at events
    includeFeedback?: boolean, // ratings/reviews given
    
    // Sorting & Pagination
    sortBy?: 'event_date' | 'registration_date' | 'attendance_date',
    sortOrder?: 'asc' | 'desc',
    limit?: number
  }
}
```

## API Endpoint
- `GET /v1/person/events`

## Test Cases
- Get complete event history
- Filter by date ranges
- Filter by participation types
- Include detailed event information
- Sort chronologically
- Handle people with extensive histories

## Priority
Medium

## Story Points
4

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
