# [PROJ_002] Story 3.8: Check In Guest

## User Story
**As a** workflow developer  
**I want to** check in guests at event time  
**So that** I can track attendance and manage event logistics

## Acceptance Criteria
- ✅ Support guest ID or event + email lookup
- ✅ Record check-in timestamp
- ✅ Handle multiple check-ins gracefully
- ✅ Support bulk check-in operations

## Technical Implementation
```typescript
// Resource: Guest
// Operation: Check In
// Parameters:
{
  // Option 1: Direct guest ID
  guestId?: string,
  
  // Option 2: Lookup by event + email
  eventId?: string,
  email?: string,
  
  additionalFields: {
    checkInTime?: string, // ISO 8601, defaults to now
    checkInLocation?: string,
    notes?: string,
    verifiedIdentity?: boolean
  }
}
```

## API Endpoint
- `POST /v1/guest/check-in` - Check in guest at event

## Test Cases
- Check in by guest ID
- Check in by email lookup
- Custom check-in time
- Duplicate check-in handling
- Invalid guest/event combination

## Priority
Medium

## Story Points
5
