# [PROJ_002] Story 4.7: Bulk Update Ticket Types

**As a** workflow developer  
**I want to** update multiple ticket types simultaneously  
**So that** I can efficiently manage pricing across multiple types

## Acceptance Criteria
- ✅ Support multiple ticket type IDs
- ✅ Apply same changes to all selected types
- ✅ Support different update strategies
- ✅ Provide batch operation results

## Technical Implementation
```typescript
// Resource: Ticket
// Operation: Bulk Update
// Parameters:
{
  ticketTypeIds: string[] (required),
  updateType: 'percentage_change' | 'fixed_change' | 'absolute_value',
  updateFields: {
    priceChange?: {
      type: 'percentage' | 'fixed';
      value: number;
    },
    capacityChange?: {
      type: 'percentage' | 'fixed' | 'absolute';
      value: number;
    },
    saleEndAt?: string,
    isHidden?: boolean
  },
  additionalFields: {
    skipIfSoldOut?: boolean,
    validateBeforeUpdate?: boolean,
    rollbackOnError?: boolean
  }
}
```

## Test Cases
- Bulk price increase by percentage
- Bulk capacity adjustment
- Bulk sale date changes
- Handle partial failures gracefully
- Rollback on validation errors

## API Endpoint
`POST /v1/event/ticket-types/bulk-update`

## Story Points
**8**

## Priority
**Medium**
