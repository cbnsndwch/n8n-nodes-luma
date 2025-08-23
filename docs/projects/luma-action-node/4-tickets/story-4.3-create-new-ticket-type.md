# [PROJ_002] Story 4.3: Create New Ticket Type

**As a** workflow developer  
**I want to** create new ticket types programmatically  
**So that** I can set up event pricing and capacity automatically

## Acceptance Criteria
- ✅ Support required fields (name, price, event ID)
- ✅ Support optional configuration (capacity, sale dates, etc.)
- ✅ Handle pricing tiers and early bird discounts
- ✅ Validate pricing and availability rules

## Technical Implementation
```typescript
// Resource: Ticket
// Operation: Create
// Parameters:
{
  eventId: string (required),
  name: string (required),
  price: number (required), // in cents
  additionalFields: {
    description?: string,
    capacity?: number,
    minQuantity?: number,
    maxQuantity?: number,
    saleStartAt?: string, // ISO 8601
    saleEndAt?: string, // ISO 8601
    isHidden?: boolean,
    requiresApproval?: boolean,
    
    // Pricing tiers
    pricingTiers?: Array<{
      name: string;
      price: number;
      startAt: string;
      endAt?: string;
      capacity?: number;
    }>,
    
    // Discount rules
    discountRules?: Array<{
      type: 'early_bird' | 'bulk' | 'promo_code';
      value: number; // percentage or fixed amount
      minQuantity?: number;
      validUntil?: string;
    }>
  }
}
```

## Test Cases
- Create basic ticket type (name + price)
- Create ticket with capacity limits
- Create ticket with sale date restrictions
- Create ticket with pricing tiers
- Create ticket with discount rules
- Validation errors for invalid configurations

## API Endpoint
`POST /v1/event/ticket-types/create`

## Story Points
**8**

## Priority
**High**
