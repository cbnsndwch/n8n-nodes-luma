# [PROJ_002] Story 3.1: List Event Guests

## User Story
**As a** workflow developer  
**I want to** retrieve all guests for a specific event  
**So that** I can manage attendee lists and communications

## Acceptance Criteria
- ✅ Support event ID input (required)
- ✅ Return list of guests with details
- ✅ Support filtering by approval status
- ✅ Support filtering by attendance status
- ✅ Include pagination for large guest lists

## Technical Implementation
```typescript
// Resource: Guest
// Operation: List
// Parameters:
{
  eventId: string (required),
  additionalFields: {
    approvalStatus?: 'approved' | 'pending' | 'rejected',
    attendanceStatus?: 'attended' | 'no_show' | 'checked_in',
    registrationStatus?: 'confirmed' | 'cancelled' | 'waitlisted',
    includeContactInfo?: boolean,
    limit?: number,
    after?: string
  }
}
```

## API Endpoint
- `GET /v1/event/get-guests` - List event guests

## Test Cases
- List all guests for event
- Filter by approval status
- Filter by attendance status
- Include/exclude contact information
- Pagination works correctly

## Priority
High

## Story Points
5
