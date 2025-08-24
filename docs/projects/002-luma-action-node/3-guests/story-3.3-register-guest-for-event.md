# [PROJ_002] Story 3.3: Register Guest for Event

## User Story
**As a** workflow developer  
**I want to** register guests for events programmatically  
**So that** I can automate registration processes from external systems

## Acceptance Criteria
- ✅ Support event ID and guest information
- ✅ Handle required vs optional guest fields
- ✅ Support ticket type selection
- ✅ Handle approval workflow (auto-approve vs pending)
- ✅ Return registration confirmation details

## Technical Implementation
```typescript
// Resource: Guest
// Operation: Register
// Parameters:
{
  eventId: string (required),
  guestInfo: {
    email: string (required),
    name: string (required),
    firstName?: string,
    lastName?: string,
    company?: string,
    jobTitle?: string,
    phone?: string,
    customFields?: Record<string, any>
  },
  additionalFields: {
    ticketTypeId?: string,
    notes?: string,
    autoApprove?: boolean,
    sendConfirmation?: boolean,
    allowWaitlist?: boolean
  }
}
```

## API Endpoint
- `POST /v1/guest/register` - Register guest for event

## Test Cases
- Register with minimal information
- Register with complete profile
- Auto-approve vs pending approval
- Waitlist handling when event full
- Invalid email/duplicate registration

## Priority
High

## Story Points
8
