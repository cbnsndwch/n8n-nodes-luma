# [PROJ_002] Story 2.11: Create Calendar Coupon

## Story
**As a** workflow developer  
**I want to** create new coupons for calendar events  
**So that** I can implement discount strategies, promotional campaigns, and dynamic pricing workflows.

## Acceptance Criteria

### Functional Requirements
- [ ] User can select "Calendar" resource and "Create Coupon" operation
- [ ] User can specify coupon name and code (required)
- [ ] User can configure discount type and value (required)
- [ ] User can set optional coupon properties (max uses, expiration, description)
- [ ] Node returns created coupon with complete metadata
- [ ] Handle coupon code uniqueness validation

### API Implementation
- **Endpoint:** `POST /public/v1/calendar/coupons/create`
- **Method:** POST
- **Content-Type:** application/json
- **Required Parameters:** `name`, `code`, `discount_type`, `discount_value`
- **Optional Parameters:** `max_uses`, `expires_at`, `description`, `is_active`

### Data Structure
```typescript
interface CreateCalendarCouponRequest {
  name: string; // Required - display name for coupon
  code: string; // Required - unique coupon code for users
  discount_type: 'percentage' | 'fixed_amount'; // Required
  discount_value: number; // Required - percentage (0-100) or cents for fixed
  max_uses?: number; // Optional - maximum uses (null = unlimited)
  expires_at?: string; // Optional - ISO 8601 expiration date
  description?: string; // Optional description
  is_active?: boolean; // Optional - default true
}

interface CreateCalendarCouponResponse {
  api_id: string;
  name: string;
  code: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  max_uses?: number;
  current_uses: number; // Initially 0
  expires_at?: string;
  is_active: boolean;
  description?: string;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}
```

## Technical Implementation

### Node Configuration
```typescript
{
  displayName: 'Coupon Name',
  name: 'name',
  type: 'string',
  required: true,
  default: '',
  placeholder: 'Enter coupon name',
  displayOptions: {
    show: {
      resource: ['calendar'],
      operation: ['createCoupon']
    }
  },
  description: 'Display name for the coupon'
},
{
  displayName: 'Coupon Code',
  name: 'code',
  type: 'string',
  required: true,
  default: '',
  placeholder: 'SAVE20',
  displayOptions: {
    show: {
      resource: ['calendar'],
      operation: ['createCoupon']
    }
  },
  description: 'Unique coupon code that users will enter'
},
{
  displayName: 'Discount Type',
  name: 'discountType',
  type: 'options',
  required: true,
  default: 'percentage',
  options: [
    { name: 'Percentage', value: 'percentage' },
    { name: 'Fixed Amount', value: 'fixed_amount' }
  ],
  displayOptions: {
    show: {
      resource: ['calendar'],
      operation: ['createCoupon']
    }
  },
  description: 'Type of discount to apply'
},
{
  displayName: 'Discount Value',
  name: 'discountValue',
  type: 'number',
  required: true,
  default: 10,
  displayOptions: {
    show: {
      resource: ['calendar'],
      operation: ['createCoupon']
    }
  },
  description: 'Discount amount (percentage 0-100 or cents for fixed amount)'
},
{
  displayName: 'Additional Fields',
  name: 'additionalFields',
  type: 'collection',
  placeholder: 'Add Field',
  default: {},
  displayOptions: {
    show: {
      resource: ['calendar'],
      operation: ['createCoupon']
    }
  },
  options: [
    {
      displayName: 'Max Uses',
      name: 'maxUses',
      type: 'number',
      default: 100,
      typeOptions: { minValue: 1 },
      description: 'Maximum number of times coupon can be used'
    },
    {
      displayName: 'Expires At',
      name: 'expiresAt',
      type: 'dateTime',
      default: '',
      description: 'Expiration date and time for the coupon'
    },
    {
      displayName: 'Description',
      name: 'description',
      type: 'string',
      default: '',
      placeholder: 'Coupon description',
      description: 'Optional description for the coupon'
    },
    {
      displayName: 'Is Active',
      name: 'isActive',
      type: 'boolean',
      default: true,
      description: 'Whether the coupon is active and can be used'
    }
  ]
}
```

### API Request Implementation
```typescript
const endpoint = '/public/v1/calendar/coupons/create';
const body: CreateCalendarCouponRequest = {
  name: this.getNodeParameter('name', i) as string,
  code: this.getNodeParameter('code', i) as string,
  discount_type: this.getNodeParameter('discountType', i) as 'percentage' | 'fixed_amount',
  discount_value: this.getNodeParameter('discountValue', i) as number
};

const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
if (additionalFields.maxUses) {
  body.max_uses = additionalFields.maxUses as number;
}
if (additionalFields.expiresAt) {
  body.expires_at = additionalFields.expiresAt as string;
}
if (additionalFields.description) {
  body.description = additionalFields.description as string;
}
if (additionalFields.isActive !== undefined) {
  body.is_active = additionalFields.isActive as boolean;
}

const response = await lumaApiRequest.call(this, 'POST', endpoint, body);
```

## Use Cases

### Common Scenarios
1. **Promotional Campaigns**: Create limited-time discount coupons
2. **Member Benefits**: Create exclusive coupons for calendar members
3. **Event Marketing**: Create event-specific promotional codes
4. **Seasonal Sales**: Create holiday or seasonal discount campaigns
5. **Referral Programs**: Create coupons for referral incentives

### Workflow Examples
- Create early bird discount coupons for upcoming events
- Set up member-only discount codes
- Generate unique coupon codes for marketing campaigns
- Create expiring coupons for flash sales
- Implement tiered discount strategies

## Error Handling

### Common Error Scenarios
1. **Authentication Errors** (401)
   - Invalid API key or expired credentials
   - **Response**: Clear error message about authentication

2. **Authorization Errors** (403)
   - Insufficient permissions to create calendar coupons
   - **Response**: Permission denied message

3. **Validation Errors** (400)
   - Empty or invalid coupon name/code
   - Invalid discount type or value
   - Discount value out of range (percentage > 100, negative values)
   - Invalid expiration date format
   - **Response**: Specific validation error details

4. **Conflict Errors** (409)
   - Coupon code already exists in calendar or events
   - **Response**: Duplicate coupon code error

5. **Rate Limiting** (429)
   - Too many requests in time window
   - **Response**: Rate limit exceeded with retry guidance

## Input Validation

### Required Validations
- Coupon name must not be empty
- Coupon code must be unique and follow format requirements
- Discount type must be valid enum value
- Discount value must be appropriate for discount type
- Expiration date must be in future (if provided)

### Format Requirements
- Name: Non-empty string, reasonable length limit
- Code: Alphanumeric string, no special characters except hyphens/underscores
- Discount Value: 
  - Percentage: 0-100
  - Fixed Amount: Positive integer in cents
- Expires At: Valid ISO 8601 datetime format
- Max Uses: Positive integer

## Important Notes

### Calendar vs Event Coupons
- Calendar coupons apply to any event managed by the calendar
- Be careful not to have the same code on an event and calendar level
- Calendar coupons provide broader coverage than event-specific coupons

## Dependencies
- Valid Luma API credentials with calendar management permissions
- Calendar must exist and be accessible by the authenticated user
- User must have permission to create coupons

## Testing Scenarios
1. Create coupon with minimal required fields
2. Create coupon with all optional fields
3. Create percentage discount coupon
4. Create fixed amount discount coupon
5. Create coupon with expiration date
6. Create coupon with usage limit
7. Attempt to create duplicate coupon code
8. Test with invalid discount values
9. Test with invalid expiration dates
10. Verify created coupon appears in list-coupons
11. Test permission errors for unauthorized users
12. Validate response structure and metadata

---

**Story Points:** 5  
**Priority:** Medium  
**Epic:** [Epic 2: Calendar Operations](./epic.md)
