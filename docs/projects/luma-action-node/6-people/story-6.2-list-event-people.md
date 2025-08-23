# Story 6.2: List Event People

**As a** workflow developer  
**I want to** retrieve all people associated with a specific event  
**So that** I can manage attendees and track participation

## Epic Reference
This story is part of [Epic 6: People Management](./epic.md)

## Acceptance Criteria
- ✅ Support event ID input (required)
- ✅ Filter by relationship type (attending, interested, etc.)
- ✅ Include attendance status and check-in information
- ✅ Support attendee categorization and segmentation

## Technical Implementation
```typescript
// Resource: People
// Operation: List Event People
// Parameters:
{
  eventId: string (required),
  additionalFields: {
    // Relationship Filtering
    relationshipType?: 'attending' | 'interested' | 'invited' | 'declined' | 'waitlisted',
    attendanceStatus?: 'checked_in' | 'no_show' | 'pending',
    ticketType?: string, // specific ticket type ID
    
    // Include Options
    includeTicketInfo?: boolean,
    includeCheckInTime?: boolean,
    includeContactInfo?: boolean,
    includeCustomFields?: boolean,
    
    // Segmentation
    registrationSource?: 'direct' | 'social' | 'referral' | 'integration',
    registeredSince?: string,
    
    // Sorting & Pagination
    sortBy?: 'registered_at' | 'check_in_time' | 'last_name' | 'ticket_type',
    sortOrder?: 'asc' | 'desc',
    page?: number,
    limit?: number
  }
}
```

## API Endpoint
- `GET /v1/event/people/list`

## Test Cases
- List event attendees by relationship type
- Filter by attendance status
- Include ticket and check-in information
- Segment by registration source
- Sort by different criteria
- Handle large attendee lists

## Priority
High

## Story Points
5

## Dependencies
- Event must exist
- Proper authentication and permissions

## Definition of Done
- [ ] Implementation follows n8n node patterns
- [ ] Input validation and error handling
- [ ] TypeScript interfaces defined
- [ ] Unit tests written and passing
- [ ] Integration tests with real API
- [ ] Documentation updated
