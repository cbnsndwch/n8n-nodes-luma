# [PROJ_002] Story 2.12: Update Calendar Coupon

## Story
**As a** workflow developer  
**I want to** update existing coupons for calendar events  
**So that** I can modify discount strategies, extend campaigns, fix coupon issues, and maintain pricing flexibility.

## Acceptance Criteria

### Functional Requirements
- [ ] User can select "Calendar" resource and "Update Coupon" operation
- [ ] User can specify coupon API ID (required)
- [ ] User can update coupon properties (name, discount, limits, expiration)
- [ ] User can activate/deactivate coupons
- [ ] Node returns updated coupon with complete metadata
- [ ] Handle coupon code uniqueness validation when updating

### API Implementation
- **Endpoint:** `POST /public/v1/calendar/coupons/update`
- **Method:** POST
- **Content-Type:** application/json
- **Required Parameters:** `api_id`
- **Optional Parameters:** `name`, `code`, `discount_type`, `discount_value`, `max_uses`, `expires_at`, `description`, `is_active`

### Data Structure
```typescript
interface UpdateCalendarCouponRequest {
  api_id: string; // Required - ID of coupon to update
  name?: string; // Optional - new display name
  code?: string; // Optional - new coupon code
  discount_type?: 'percentage' | 'fixed_amount'; // Optional - new discount type
  discount_value?: number; // Optional - new discount value
  max_uses?: number; // Optional - new maximum uses (null = unlimited)
  expires_at?: string; // Optional - new expiration date (ISO 8601)
  description?: string; // Optional - new description
  is_active?: boolean; // Optional - activate/deactivate coupon
}

interface UpdateCalendarCouponResponse {
  api_id: string;
  name: string;
  code: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  max_uses?: number;
  current_uses: number; // Current usage count
  expires_at?: string;
  is_active: boolean;
  description?: string;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601 (updated timestamp)
}
```

## Technical Implementation

### Node Configuration
```typescript
{
  displayName: 'Coupon ID',
  name: 'apiId',
  type: 'string',
  required: true,
  default: '',
  placeholder: 'coupon_123abc...',
  displayOptions: {
    show: {
      resource: ['calendar'],
      operation: ['updateCoupon']
    }
  },
  description: 'API ID of the coupon to update'
},
{
  displayName: 'Update Fields',
  name: 'updateFields',
  type: 'collection',
  placeholder: 'Add Field',
  default: {},
  displayOptions: {
    show: {
      resource: ['calendar'],
      operation: ['updateCoupon']
    }
  },
  options: [
    {
      displayName: 'Name',
      name: 'name',
      type: 'string',
      default: '',
      placeholder: 'New coupon name',
      description: 'Updated display name for the coupon'
    },
    {
      displayName: 'Code',
      name: 'code',
      type: 'string',
      default: '',
      placeholder: 'NEW_CODE',
      description: 'Updated coupon code that users will enter'
    },
    {
      displayName: 'Discount Type',
      name: 'discountType',
      type: 'options',
      default: 'percentage',
      options: [
        { name: 'Percentage', value: 'percentage' },
        { name: 'Fixed Amount', value: 'fixed_amount' }
      ],
      description: 'Updated discount type'
    },
    {
      displayName: 'Discount Value',
      name: 'discountValue',
      type: 'number',
      default: 10,
      description: 'Updated discount amount (percentage 0-100 or cents for fixed amount)'
    },
    {
      displayName: 'Max Uses',
      name: 'maxUses',
      type: 'number',
      default: 100,
      typeOptions: { minValue: 1 },
      description: 'Updated maximum number of times coupon can be used'
    },
    {
      displayName: 'Expires At',
      name: 'expiresAt',
      type: 'dateTime',
      default: '',
      description: 'Updated expiration date and time for the coupon'
    },
    {
      displayName: 'Description',
      name: 'description',
      type: 'string',
      default: '',
      placeholder: 'Updated coupon description',
      description: 'Updated description for the coupon'
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
const endpoint = '/public/v1/calendar/coupons/update';
const body: UpdateCalendarCouponRequest = {
  api_id: this.getNodeParameter('apiId', i) as string
};

const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
if (updateFields.name) {
  body.name = updateFields.name as string;
}
if (updateFields.code) {
  body.code = updateFields.code as string;
}
if (updateFields.discountType) {
  body.discount_type = updateFields.discountType as 'percentage' | 'fixed_amount';
}
if (updateFields.discountValue !== undefined) {
  body.discount_value = updateFields.discountValue as number;
}
if (updateFields.maxUses !== undefined) {
  body.max_uses = updateFields.maxUses as number;
}
if (updateFields.expiresAt) {
  body.expires_at = updateFields.expiresAt as string;
}
if (updateFields.description !== undefined) {
  body.description = updateFields.description as string;
}
if (updateFields.isActive !== undefined) {
  body.is_active = updateFields.isActive as boolean;
}

const response = await lumaApiRequest.call(this, 'POST', endpoint, body);
```

## Use Cases

### Common Scenarios
1. **Campaign Extensions**: Extend coupon expiration dates for successful campaigns
2. **Discount Adjustments**: Modify discount values based on performance
3. **Usage Limit Changes**: Increase max uses for popular coupons
4. **Emergency Deactivation**: Quickly disable problematic coupons
5. **Code Updates**: Change coupon codes for rebranding or security

### Workflow Examples
- Automatically extend expiring high-performing coupons
- Adjust discount values based on inventory levels
- Deactivate coupons that have reached budget limits
- Update coupon descriptions for clarity
- Rebrand coupon codes for new campaigns

## Error Handling

### Common Error Scenarios
1. **Authentication Errors** (401)
   - Invalid API key or expired credentials
   - **Response**: Clear error message about authentication

2. **Authorization Errors** (403)
   - Insufficient permissions to update calendar coupons
   - **Response**: Permission denied message

3. **Validation Errors** (400)
   - Invalid coupon API ID format
   - Invalid discount type or value
   - Discount value out of range
   - Invalid expiration date format
   - **Response**: Specific validation error details

4. **Not Found Errors** (404)
   - Coupon with specified API ID not found
   - **Response**: Coupon not found error

5. **Conflict Errors** (409)
   - New coupon code already exists (if updating code)
   - **Response**: Duplicate coupon code error

6. **Business Logic Errors** (400)
   - Cannot reduce max_uses below current_uses
   - Cannot set expiration in the past
   - **Response**: Business rule violation error

7. **Rate Limiting** (429)
   - Too many requests in time window
   - **Response**: Rate limit exceeded with retry guidance

## Input Validation

### Required Validations
- Coupon API ID must be valid format and exist
- At least one field must be provided for update
- Discount values must be appropriate for discount type
- Expiration date must be in future (if provided)
- Max uses cannot be less than current uses

### Format Requirements
- API ID: Valid Luma API ID format
- Name: Non-empty string (if provided)
- Code: Unique alphanumeric string (if provided)
- Discount Value: 
  - Percentage: 0-100
  - Fixed Amount: Positive integer in cents
- Expires At: Valid ISO 8601 datetime format
- Max Uses: Must be >= current_uses

## Business Considerations

### Impact of Updates
- Changing discount type/value affects future uses only
- Deactivating coupons prevents new uses but doesn't affect past transactions
- Extending expiration can reactivate expired coupons
- Code changes require user communication

### Usage Tracking
- Current usage count is preserved during updates
- Max uses cannot be set below current usage
- Usage statistics remain accurate across updates

## Dependencies
- Valid Luma API credentials with calendar management permissions
- Calendar must exist and be accessible by the authenticated user
- Coupon with specified API ID must exist
- User must have permission to update coupons

## Testing Scenarios
1. Update only coupon name
2. Update only discount value
3. Update discount type (percentage to fixed amount)
4. Extend expiration date
5. Increase max uses limit
6. Activate/deactivate coupon
7. Update coupon code
8. Update multiple fields simultaneously
9. Attempt to update non-existent coupon
10. Attempt to set max_uses below current_uses
11. Attempt to set expiration in the past
12. Test with duplicate coupon code
13. Verify updated_at timestamp changes
14. Test permission errors for unauthorized users
15. Validate response structure and metadata

---

**Story Points:** 5  
**Priority:** Medium  
**Epic:** [Epic 2: Calendar Operations](./epic.md)
