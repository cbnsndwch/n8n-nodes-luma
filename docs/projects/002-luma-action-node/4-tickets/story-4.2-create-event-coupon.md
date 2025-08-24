# [PROJ_002] Story 4.2: Create Event Coupon

## User Story
**As a** event organizer  
**I want to** create new event-specific coupons  
**So that** I can offer promotional pricing and discounts

## Acceptance Criteria
- ✅ Support event ID input (required)
- ✅ Configure discount type and value
- ✅ Set usage limits and validity period
- ✅ Return created coupon details

## Technical Implementation
```typescript
// Resource: Event
// Operation: Create Coupon
// Parameters:
{
  eventId: string (required),
  name: string (required),
  code: string (required),
  discountType: 'percentage' | 'fixed_amount' (required),
  discountValue: number (required),
  additionalFields: {
    description?: string,
    maxUses?: number,
    maxUsesPerUser?: number,
    startsAt?: string, // ISO 8601
    expiresAt?: string, // ISO 8601
    isPublic?: boolean
  }
}
```

## API Endpoint
- `POST /public/v1/event/create-coupon` - Create event coupon

## Request Body Structure
```typescript
interface CreateCouponRequest {
  event_api_id: string;
  name: string;
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  max_uses?: number;
  max_uses_per_user?: number;
  starts_at?: string;
  expires_at?: string;
  is_public?: boolean;
}
```

## Response Structure
```typescript
interface CreateCouponResponse {
  coupon: {
    api_id: string;
    event_api_id: string;
    name: string;
    code: string;
    description?: string;
    discount_type: 'percentage' | 'fixed_amount';
    discount_value: number;
    max_uses?: number;
    current_uses: number;
    max_uses_per_user?: number;
    starts_at?: string;
    expires_at?: string;
    is_active: boolean;
    is_public: boolean;
    created_at: string;
    updated_at: string;
    created_by_user_api_id: string;
  };
}
```

## Test Cases
- Create percentage discount coupon
- Create fixed amount discount coupon
- Set usage limits and expiration
- Handle duplicate coupon codes
- Validate discount value ranges

## Priority
High

## Story Points
8

## Epic
[Epic 4: Ticket Management](./epic.md)

## GitHub Issue
[Story 4.2: Create Event Coupon](https://github.com/cbnsndwch/n8n-nodes-luma/issues/37)
