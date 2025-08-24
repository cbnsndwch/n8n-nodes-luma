# [PROJ_002] Story 4.4: Update Ticket Type Configuration

**As a** workflow developer  
**I want to** modify existing ticket type settings  
**So that** I can adjust pricing and availability as needed

## Acceptance Criteria
- ✅ Support ticket type ID identification
- ✅ Allow partial updates of ticket configuration
- ✅ Handle price changes with impact warnings
- ✅ Preserve existing sales data during updates

## Technical Implementation
```typescript
// Resource: Ticket
// Operation: Update
// Parameters:
{
  ticketTypeId: string (required),
  updateFields: {
    name?: string,
    description?: string,
    price?: number,
    capacity?: number,
    minQuantity?: number,
    maxQuantity?: number,
    saleStartAt?: string,
    saleEndAt?: string,
    isHidden?: boolean,
    requiresApproval?: boolean,
    pricingTiers?: Array<object>,
    discountRules?: Array<object>
  },
  additionalFields: {
    preserveExistingSales?: boolean,
    notifyExistingBuyers?: boolean,
    reasonForChange?: string
  }
}
```

## Test Cases
- Update single field preserves others
- Price changes handle existing sales
- Capacity changes validate against sold tickets
- Sale date changes handle active sales
- Invalid updates return appropriate errors

## API Endpoint
`POST /v1/event/ticket-types/update`

## Story Points
**5**

## Priority
**Medium**
