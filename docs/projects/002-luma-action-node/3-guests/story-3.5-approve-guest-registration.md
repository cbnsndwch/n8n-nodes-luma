# [PROJ_002] Story 3.5: Approve Guest Registration

## User Story
**As a** workflow developer  
**I want to** approve pending guest registrations  
**So that** I can automate approval workflows based on custom criteria

## Acceptance Criteria
- ✅ Support guest ID or multiple guest IDs
- ✅ Move guest from pending to approved status
- ✅ Send approval notifications
- ✅ Handle approval with conditions/notes

## Technical Implementation
```typescript
// Resource: Guest
// Operation: Approve
// Parameters:
{
  guestId: string | string[] (required),
  additionalFields: {
    sendNotification?: boolean,
    approvalNotes?: string,
    ticketTypeId?: string, // assign specific ticket type
    customMessage?: string
  }
}
```

## API Endpoint
- `POST /v1/guest/approve` - Approve guest registration

## Test Cases
- Approve single guest
- Bulk approve multiple guests
- Approval with custom message
- Notification sending
- Already approved guest handling

## Priority
High

## Story Points
5
