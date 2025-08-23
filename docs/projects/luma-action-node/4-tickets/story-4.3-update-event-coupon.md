# [PROJ_002] Story 4.3: Update Event Coupon

## User Story
**As a** event organizer  
**I want to** modify existing event coupon settings  
**So that** I can adjust discount terms and availability

## Acceptance Criteria
- ✅ Support coupon ID input (required)
- ✅ Accept partial update data
- ✅ Validate setting changes
- ✅ Return updated coupon details

## Technical Implementation
```typescript
// Resource: Event
// Operation: Update Coupon
// Parameters:
{
  couponId: string (required),
  updateFields: {
    name?: string,
    description?: string,
    maxUses?: number,
    expiresAt?: string, // ISO 8601
    isActive?: boolean,
    isPublic?: boolean
  }
}
```

## API Endpoint
- `POST /public/v1/event/update-coupon` - Update event coupon

## Request Body Structure
```typescript
interface UpdateCouponRequest {
  coupon_api_id: string;
  name?: string;
  description?: string;
  max_uses?: number;
  expires_at?: string;
  is_active?: boolean;
  is_public?: boolean;
}
```

## Response Structure
```typescript
interface UpdateCouponResponse {
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
    created_by_user_api_id?: string;
  };
}
```

## Test Cases
- Update coupon name and description
- Modify usage limits
- Change expiration date
- Toggle active/inactive status
- Handle invalid coupon IDs

## Priority
Medium

## Story Points
5

## Epic
[Epic 4: Ticket Management](./epic.md)

## GitHub Issue
[Story 4.3: Update Event Coupon](https://github.com/cbnsndwch/n8n-nodes-luma/issues/38)
