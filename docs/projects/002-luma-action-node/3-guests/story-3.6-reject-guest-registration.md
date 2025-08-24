# [PROJ_002] Story 3.6: Reject Guest Registration

## User Story
**As a** workflow developer  
**I want to** reject guest registrations that don't meet criteria  
**So that** I can maintain event quality and capacity limits

## Acceptance Criteria
- ✅ Support guest ID or multiple guest IDs
- ✅ Move guest from pending to rejected status
- ✅ Provide rejection reason
- ✅ Send rejection notifications with explanation

## Technical Implementation
```typescript
// Resource: Guest
// Operation: Reject
// Parameters:
{
  guestId: string | string[] (required),
  rejectionReason: string (required),
  additionalFields: {
    sendNotification?: boolean,
    customMessage?: string,
    allowReapply?: boolean
  }
}
```

## API Endpoint
- `POST /v1/guest/reject` - Reject guest registration

## Test Cases
- Reject single guest with reason
- Bulk reject multiple guests
- Custom rejection message
- Reapplication settings
- Already processed guest handling

## Priority
Medium

## Story Points
3
