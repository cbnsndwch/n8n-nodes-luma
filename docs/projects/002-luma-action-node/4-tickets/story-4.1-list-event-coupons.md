# [PROJ_002] Story 4.1: List Event Coupons

## User Story
**As a** event organizer  
**I want to** retrieve all coupons for a specific event  
**So that** I can view current discounts and promotional offers

## Acceptance Criteria
- ✅ Support event ID input (required)
- ✅ Return comprehensive coupon list
- ✅ Include coupon usage statistics
- ✅ Filter by active/inactive status

## Technical Implementation
```typescript
// Resource: Event
// Operation: List Coupons
// Parameters:
{
  eventId: string (required),
  additionalFields: {
    includeInactive?: boolean,
    includeUsageStats?: boolean,
    sortBy?: 'name' | 'created_at' | 'expires_at' | 'usage',
    sortOrder?: 'asc' | 'desc'
  }
}
```

## API Endpoint
- `GET /public/v1/event/coupons` - List event coupons

## Response Structure
```typescript
interface EventCouponsResponse {
  coupons: Array<{
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
  }>;
  total_count: number;
}
```

## Test Cases
- List all active coupons
- Include inactive coupons
- Filter by expiration date
- Sort by usage statistics
- Handle empty coupon list

## Priority
High

## Story Points
3

## Epic
[Epic 4: Ticket Management](./epic.md)

## GitHub Issue
[Story 4.1: List Event Coupons](https://github.com/cbnsndwch/n8n-nodes-luma/issues/35)
