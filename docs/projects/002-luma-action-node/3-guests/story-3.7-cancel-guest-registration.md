# [PROJ_002] Story 3.7: Cancel Guest Registration

## User Story
**As a** workflow developer  
**I want to** cancel guest registrations when needed  
**So that** I can handle cancellations and free up capacity

## Acceptance Criteria
- ✅ Support guest ID identification
- ✅ Handle cancellation by guest vs organizer
- ✅ Update event capacity appropriately
- ✅ Send cancellation confirmations

## Technical Implementation
```typescript
// Resource: Guest
// Operation: Cancel
// Parameters:
{
  guestId: string (required),
  additionalFields: {
    cancellationReason?: string,
    refundRequested?: boolean,
    sendNotification?: boolean,
    cancelledBy?: 'guest' | 'organizer'
  }
}
```

## API Endpoint
- `POST /v1/guest/cancel` - Cancel guest registration

## Test Cases
- Guest-initiated cancellation
- Organizer-initiated cancellation
- Capacity updates correctly
- Refund handling
- Notification sending

## Priority
Low

## Story Points
3
