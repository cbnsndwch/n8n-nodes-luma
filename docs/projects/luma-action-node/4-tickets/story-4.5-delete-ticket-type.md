# [PROJ_002] Story 4.5: Delete Ticket Type

**As a** workflow developer  
**I want to** remove ticket types that are no longer needed  
**So that** I can clean up event pricing structure

## Acceptance Criteria
- ✅ Support ticket type ID identification
- ✅ Handle existing sales gracefully
- ✅ Support soft delete vs hard delete
- ✅ Provide impact analysis before deletion

## Technical Implementation
```typescript
// Resource: Ticket
// Operation: Delete
// Parameters:
{
  ticketTypeId: string (required),
  additionalFields: {
    force?: boolean, // allow deletion with existing sales
    archiveInstead?: boolean, // soft delete
    transferSalesToTypeId?: string, // transfer to another type
    refundExistingSales?: boolean
  }
}
```

## Test Cases
- Delete ticket type with no sales
- Delete ticket type with existing sales (various strategies)
- Archive ticket type instead of delete
- Transfer sales to another ticket type
- Handle invalid transfer targets

## API Endpoint
`POST /v1/event/ticket-types/delete`

## Story Points
**3**

## Priority
**Low**
