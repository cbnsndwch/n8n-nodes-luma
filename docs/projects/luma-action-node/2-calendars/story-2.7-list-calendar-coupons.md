# [PROJ_002] Story 2.7: List Calendar Coupons

## User Story
**As a** workflow developer  
**I want to** retrieve all coupons available for a calendar  
**So that** I can manage promotional campaigns and pricing

## Acceptance Criteria
- ✅ Support calendar ID input (required)
- ✅ Return list of coupons with details
- ✅ Support filtering by status (active, expired, etc.)
- ✅ Include usage statistics

## Technical Implementation
```typescript
// Resource: Calendar
// Operation: List Coupons
// Parameters:
{
  calendarId: string (required),
  additionalFields: {
    status?: 'active' | 'expired' | 'disabled',
    includeUsage?: boolean,
    limit?: number,
    after?: string
  }
}
```

## Test Cases
- List all coupons in calendar
- Filter by coupon status
- Include usage statistics
- Pagination works correctly
- Empty calendar returns empty list

## API Endpoint
- `GET /v1/calendar/list-coupons`

## Priority
Low

## Story Points
3

## Epic
[Epic 2: Calendar Operations](./epic.md)
