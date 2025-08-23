# [PROJ_002] Story 2.10: List Calendar Coupons

## Story
**As a** workflow developer  
**I want to** retrieve list of coupons for calendar events  
**So that** I can analyze discount strategies, manage coupon campaigns, and implement pricing workflows.

## Acceptance Criteria

### Functional Requirements
- [ ] User can select "Calendar" resource and "List Coupons" operation
- [ ] User can configure pagination options
- [ ] Node returns paginated list of calendar coupons with complete metadata
- [ ] Each coupon includes usage statistics and configuration details

### API Implementation
- **Endpoint:** `GET /public/v1/calendar/coupons`
- **Required Parameters:** None (all parameters are optional)
- **Optional Parameters:** 
  - `pagination_cursor` - For pagination
  - `pagination_limit` - Number of items to return

### Data Structure
```typescript
interface CalendarCouponsListResponse {
  has_more: boolean;
  next_cursor?: string;
  entries: CalendarCoupon[];
}

interface CalendarCoupon {
  api_id: string;
  name: string;
  code: string; // Coupon code used by users
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number; // Percentage (0-100) or cents for fixed amount
  max_uses?: number; // Maximum number of uses (null = unlimited)
  current_uses: number; // Current number of times used
  expires_at?: string; // ISO 8601 expiration date (null = no expiration)
  is_active: boolean; // Whether coupon is currently active
  description?: string;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}
```

## Technical Implementation

### Node Configuration
```typescript
{
  displayName: 'Pagination Limit',
  name: 'paginationLimit',
  type: 'number',
  default: 50,
  typeOptions: {
    minValue: 1,
    maxValue: 100
  },
  displayOptions: {
    show: {
      resource: ['calendar'],
      operation: ['listCoupons']
    }
  },
  description: 'Number of coupons to return (1-100)'
},
{
  displayName: 'Pagination Cursor',
  name: 'paginationCursor',
  type: 'string',
  default: '',
  placeholder: 'Value from previous response next_cursor',
  displayOptions: {
    show: {
      resource: ['calendar'],
      operation: ['listCoupons']
    }
  },
  description: 'Cursor for pagination from previous request'
}
```

### API Request Implementation
```typescript
const endpoint = '/public/v1/calendar/coupons';
const queryParams = new URLSearchParams();

if (paginationCursor) queryParams.append('pagination_cursor', paginationCursor);
if (paginationLimit) queryParams.append('pagination_limit', paginationLimit.toString());

const response = await lumaApiRequest.call(this, 'GET', `${endpoint}?${queryParams}`);
```

## Use Cases

### Common Scenarios
1. **Coupon Management**: List all available coupons for administrative purposes
2. **Usage Analytics**: Analyze coupon performance and usage statistics
3. **Campaign Monitoring**: Track active discount campaigns
4. **Inventory Management**: Monitor coupon usage limits and availability
5. **Reporting**: Generate coupon usage reports for business analysis

### Workflow Examples
- Export coupon lists for external analytics tools
- Monitor high-usage coupons approaching limits
- Generate reports on discount campaign effectiveness
- Set up alerts for expiring coupons
- Create usage dashboards for marketing teams

## Error Handling

### Common Error Scenarios
1. **Authentication Errors** (401)
   - Invalid API key or expired credentials
   - **Response**: Clear error message about authentication

2. **Authorization Errors** (403)
   - Insufficient permissions to access calendar coupons
   - **Response**: Permission denied message

3. **Validation Errors** (400)
   - Invalid pagination parameters
   - **Response**: Specific validation error details

4. **Rate Limiting** (429)
   - Too many requests in time window
   - **Response**: Rate limit exceeded with retry guidance

## Data Processing

### Coupon Status Analysis
- Calculate usage percentage (current_uses / max_uses)
- Identify expiring coupons
- Flag inactive or expired coupons
- Categorize by discount type and value

### Usage Insights
- Track high-performing coupons
- Identify unused coupons
- Monitor approaching usage limits
- Analyze discount distribution

## Dependencies
- Valid Luma API credentials with calendar access permissions
- Calendar must exist and be accessible by the authenticated user

## Testing Scenarios
1. List all calendar coupons without pagination
2. Test pagination with cursor-based navigation
3. Handle empty coupon lists gracefully
4. Validate pagination parameters
5. Test with different pagination limits
6. Verify coupon metadata completeness
7. Test with various coupon states (active, inactive, expired)
8. Handle API errors appropriately
9. Validate usage statistics accuracy
10. Test with coupons at usage limits

---

**Story Points:** 3  
**Priority:** Medium  
**Epic:** [Epic 2: Calendar Operations](./epic.md)
