# [PROJ_002] Epic 5: Coupon Management

## Overview
Implement comprehensive coupon and promotional code management operations for the Luma Action Node, enabling users to create, manage, and track promotional campaigns through n8n workflows.

## Epic Goals
- Enable complete coupon lifecycle management
- Support various discount types and conditions
- Handle coupon usage tracking and analytics
- Provide promotional campaign automation

## API Endpoints Covered

### Coupon Operations
- `GET /v1/event/coupons/list` - List coupons for event/calendar
- `GET /v1/calendar/coupons/list` - List calendar-wide coupons
- `GET /v1/event/coupons/get` - Get coupon details
- `POST /v1/event/coupons/create` - Create event coupon
- `POST /v1/calendar/coupons/create` - Create calendar coupon
- `POST /v1/event/coupons/update` - Update coupon configuration
- `POST /v1/event/coupons/delete` - Delete/deactivate coupon
- `GET /v1/event/coupons/analytics` - Get coupon usage analytics
- `POST /v1/event/coupons/bulk-create` - Create multiple coupons

## User Stories

### Story 5.1: List Coupons
**As a** workflow developer  
**I want to** retrieve all coupons for events or calendars  
**So that** I can manage promotional campaigns effectively

#### Acceptance Criteria
- ✅ Support both event-level and calendar-level coupon listing
- ✅ Filter coupons by status (active, expired, disabled)
- ✅ Include usage statistics for each coupon
- ✅ Support pagination for large coupon lists

#### Technical Implementation
```typescript
// Resource: Coupon
// Operation: List
// Parameters:
{
  scope: 'event' | 'calendar',
  scopeId: string (required), // eventId or calendarId
  additionalFields: {
    status?: 'active' | 'expired' | 'disabled' | 'all',
    includeUsageStats?: boolean,
    includeExpired?: boolean,
    sortBy?: 'created_at' | 'expiry_date' | 'usage_count' | 'discount_value',
    sortOrder?: 'asc' | 'desc',
    page?: number,
    limit?: number
  }
}
```

#### Test Cases
- List event coupons with all statuses
- List calendar coupons (calendar-wide)
- Filter by active coupons only
- Include usage statistics
- Sort by different criteria
- Handle pagination correctly

---

### Story 5.2: Get Coupon Details
**As a** workflow developer  
**I want to** retrieve detailed information about a specific coupon  
**So that** I can access usage rules and redemption history

#### Acceptance Criteria
- ✅ Support coupon ID input (required)
- ✅ Return complete coupon configuration
- ✅ Include discount rules and conditions
- ✅ Include usage history and analytics

#### Technical Implementation
```typescript
// Resource: Coupon
// Operation: Get
// Parameters:
{
  couponId: string (required),
  additionalFields: {
    includeUsageHistory?: boolean,
    includeAnalytics?: boolean,
    includeConditions?: boolean,
    maxHistoryRecords?: number
  }
}
```

#### Test Cases
- Valid coupon ID returns details
- Invalid coupon ID returns error
- Usage history included when requested
- Analytics data properly formatted
- Condition rules accessible

---

### Story 5.3: Create Event Coupon
**As a** workflow developer  
**I want to** create new coupons for specific events  
**So that** I can set up targeted promotional campaigns

#### Acceptance Criteria
- ✅ Support required fields (code, discount type, value)
- ✅ Support various discount types (percentage, fixed, buy-one-get-one)
- ✅ Handle usage limits and expiry dates
- ✅ Support complex eligibility conditions

#### Technical Implementation
```typescript
// Resource: Coupon
// Operation: Create Event Coupon
// Parameters:
{
  eventId: string (required),
  code: string (required),
  discountType: 'percentage' | 'fixed_amount' | 'bogo' | 'free_ticket',
  discountValue: number (required),
  
  additionalFields: {
    // Basic Configuration
    name?: string,
    description?: string,
    isActive?: boolean,
    
    // Usage Limits
    maxUses?: number, // null = unlimited
    maxUsesPerUser?: number,
    minPurchaseAmount?: number,
    
    // Validity Period
    validFrom?: string, // ISO 8601
    validUntil?: string, // ISO 8601
    
    // Applicable Items
    applicableTicketTypes?: string[], // specific ticket type IDs
    excludeTicketTypes?: string[],
    
    // Conditions
    firstTimeUsersOnly?: boolean,
    requiresEmailDomain?: string[], // e.g., ['@company.com']
    requiresInviteCode?: string,
    
    // BOGO Configuration (for buy-one-get-one)
    bogoConfig?: {
      buyQuantity: number;
      getQuantity: number;
      getFreeTicketTypeId?: string;
    },
    
    // Advanced Rules
    stackableWithOtherCoupons?: boolean,
    autoApply?: boolean, // auto-apply if conditions met
    notificationSettings?: {
      emailOnUse?: boolean;
      webhookOnUse?: string;
    }
  }
}
```

#### Test Cases
- Create basic percentage discount coupon
- Create fixed amount discount coupon
- Create BOGO coupon with configuration
- Create coupon with usage limits
- Create coupon with eligibility conditions
- Validation errors for invalid configurations

---

### Story 5.4: Create Calendar Coupon
**As a** workflow developer  
**I want to** create calendar-wide coupons  
**So that** I can run promotional campaigns across multiple events

#### Acceptance Criteria
- ✅ Support calendar-level coupon creation
- ✅ Apply to all events in calendar by default
- ✅ Support event filtering within calendar
- ✅ Handle inheritance and override rules

#### Technical Implementation
```typescript
// Resource: Coupon
// Operation: Create Calendar Coupon
// Parameters:
{
  calendarId: string (required),
  code: string (required),
  discountType: 'percentage' | 'fixed_amount' | 'bogo' | 'free_ticket',
  discountValue: number (required),
  
  additionalFields: {
    // Inherits most fields from Event Coupon
    ...eventCouponFields,
    
    // Calendar-specific
    applyToAllEvents?: boolean,
    includeEventIds?: string[], // specific events only
    excludeEventIds?: string[], // exclude specific events
    applyToFutureEvents?: boolean, // auto-apply to new events
    
    // Event Filtering
    eventFilter?: {
      eventTypes?: string[],
      tags?: string[],
      priceRange?: {
        min?: number;
        max?: number;
      }
    }
  }
}
```

#### Test Cases
- Create calendar-wide coupon for all events
- Create coupon for specific events only
- Create coupon with event filtering
- Apply to future events automatically
- Handle event exclusions

---

### Story 5.5: Update Coupon Configuration
**As a** workflow developer  
**I want to** modify existing coupon settings  
**So that** I can adjust promotional campaigns as needed

#### Acceptance Criteria
- ✅ Support coupon ID identification
- ✅ Allow partial updates of coupon configuration
- ✅ Handle usage limit changes appropriately
- ✅ Preserve existing usage history

#### Technical Implementation
```typescript
// Resource: Coupon
// Operation: Update
// Parameters:
{
  couponId: string (required),
  updateFields: {
    name?: string,
    description?: string,
    isActive?: boolean,
    discountValue?: number,
    maxUses?: number,
    maxUsesPerUser?: number,
    validFrom?: string,
    validUntil?: string,
    applicableTicketTypes?: string[],
    excludeTicketTypes?: string[],
    // ... other updatable fields
  },
  additionalFields: {
    preserveExistingUses?: boolean,
    notifyExistingUsers?: boolean,
    reasonForChange?: string,
    extendExpiryForActiveUsers?: boolean
  }
}
```

#### Test Cases
- Update single field preserves others
- Usage limit changes handle existing uses
- Expiry date changes validate against usage
- Discount value changes affect new uses only
- Invalid updates return appropriate errors

---

### Story 5.6: Delete/Deactivate Coupon
**As a** workflow developer  
**I want to** remove or disable coupons  
**So that** I can end promotional campaigns

#### Acceptance Criteria
- ✅ Support coupon ID identification
- ✅ Handle existing usage gracefully
- ✅ Support soft delete vs hard delete
- ✅ Provide usage impact analysis

#### Technical Implementation
```typescript
// Resource: Coupon
// Operation: Delete
// Parameters:
{
  couponId: string (required),
  deleteType: 'deactivate' | 'soft_delete' | 'hard_delete',
  additionalFields: {
    honorExistingReservations?: boolean,
    notifyAffectedUsers?: boolean,
    replacementCouponId?: string,
    gracePeriodHours?: number // allow usage for X more hours
  }
}
```

#### Test Cases
- Deactivate coupon (soft disable)
- Soft delete preserving usage history
- Hard delete with cleanup
- Honor existing reservations
- Handle coupon replacement

---

### Story 5.7: Get Coupon Analytics
**As a** workflow developer  
**I want to** retrieve usage analytics for coupons  
**So that** I can measure promotional campaign effectiveness

#### Acceptance Criteria
- ✅ Support coupon ID or campaign-level analytics
- ✅ Return usage statistics and revenue impact
- ✅ Support date range filtering
- ✅ Include conversion and performance metrics

#### Technical Implementation
```typescript
// Resource: Coupon
// Operation: Analytics
// Parameters:
{
  // Option 1: Single coupon analytics
  couponId?: string,
  
  // Option 2: Campaign analytics (multiple coupons)
  campaignName?: string,
  eventId?: string,
  calendarId?: string,
  
  additionalFields: {
    dateFrom?: string, // ISO 8601
    dateTo?: string, // ISO 8601
    includeRevenuImpact?: boolean,
    includeUserSegmentation?: boolean,
    groupBy?: 'day' | 'week' | 'month' | 'event',
    compareWithBaseline?: boolean
  }
}
```

#### Test Cases
- Get analytics for single coupon
- Get campaign-level analytics
- Filter by date range
- Include revenue impact analysis
- User segmentation data
- Performance comparisons

---

### Story 5.8: Bulk Create Coupons
**As a** workflow developer  
**I want to** create multiple coupons simultaneously  
**So that** I can efficiently set up large promotional campaigns

#### Acceptance Criteria
- ✅ Support bulk coupon generation
- ✅ Generate unique codes automatically
- ✅ Apply same configuration to all coupons
- ✅ Support code patterns and prefixes

#### Technical Implementation
```typescript
// Resource: Coupon
// Operation: Bulk Create
// Parameters:
{
  eventId?: string,
  calendarId?: string,
  
  // Bulk Configuration
  quantity: number (required),
  codePattern?: string, // e.g., "SAVE{####}" generates SAVE0001, SAVE0002
  codePrefix?: string,
  codeSuffix?: string,
  
  // Shared Configuration
  discountType: 'percentage' | 'fixed_amount' | 'bogo' | 'free_ticket',
  discountValue: number (required),
  
  // Individual Limits
  maxUsesPerCoupon?: number,
  maxUsesPerUser?: number,
  
  // Shared Settings (inherit from single coupon creation)
  sharedSettings: {
    validFrom?: string,
    validUntil?: string,
    applicableTicketTypes?: string[],
    // ... other shared fields
  },
  
  additionalFields: {
    generateUniqueCodesOnly?: boolean,
    distributeEvenly?: boolean, // distribute usage limits evenly
    createCampaignGroup?: boolean,
    campaignName?: string
  }
}
```

#### Test Cases
- Generate bulk coupons with patterns
- Create unique codes without conflicts
- Apply shared configuration correctly
- Distribute limits appropriately
- Group as campaign for analytics

---

## Data Models

### Coupon Object Structure
```typescript
interface LumaCoupon {
  coupon_id: string;
  code: string;
  name?: string;
  description?: string;
  
  // Scope
  scope: 'event' | 'calendar';
  event_id?: string;
  calendar_id?: string;
  
  // Discount Configuration
  discount_type: 'percentage' | 'fixed_amount' | 'bogo' | 'free_ticket';
  discount_value: number;
  currency?: string;
  
  // Usage Limits
  max_uses?: number; // null = unlimited
  max_uses_per_user?: number;
  current_uses: number;
  
  // Validity
  valid_from?: string;
  valid_until?: string;
  is_active: boolean;
  
  // Conditions
  min_purchase_amount?: number;
  applicable_ticket_types?: string[];
  exclude_ticket_types?: string[];
  first_time_users_only?: boolean;
  required_email_domains?: string[];
  
  // BOGO Configuration
  bogo_config?: {
    buy_quantity: number;
    get_quantity: number;
    get_free_ticket_type_id?: string;
  };
  
  // Advanced Settings
  stackable_with_other_coupons: boolean;
  auto_apply: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Analytics (optional)
  analytics?: {
    total_uses: number;
    unique_users: number;
    total_discount_given: number;
    conversion_rate: number;
    avg_order_value_with_coupon: number;
    revenue_impact: number; // negative = discount given
  };
}
```

### Coupon Usage Record
```typescript
interface CouponUsage {
  usage_id: string;
  coupon_id: string;
  user_id?: string;
  user_email?: string;
  event_id: string;
  
  // Usage Details
  order_id: string;
  discount_applied: number;
  original_amount: number;
  final_amount: number;
  tickets_purchased: number;
  
  // Context
  used_at: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
}
```

### Coupon Analytics Response
```typescript
interface CouponAnalytics {
  coupon_id?: string;
  campaign_name?: string;
  date_from: string;
  date_to: string;
  
  // Usage Metrics
  total_uses: number;
  unique_users: number;
  total_discount_given: number;
  avg_discount_per_use: number;
  
  // Performance Metrics
  conversion_rate: number; // views to usage
  redemption_rate: number; // distributed to used
  
  // Revenue Impact
  gross_revenue_with_coupons: number;
  total_discount_amount: number;
  net_revenue_impact: number;
  revenue_per_coupon_use: number;
  
  // User Behavior
  avg_order_value_with_coupon: number;
  avg_order_value_without_coupon?: number; // for comparison
  repeat_usage_rate: number;
  
  // Time-based Data
  usage_by_period?: Array<{
    period: string;
    uses: number;
    discount_given: number;
    unique_users: number;
  }>;
  
  // Event Breakdown
  usage_by_event?: Array<{
    event_id: string;
    event_name: string;
    uses: number;
    discount_given: number;
    percentage_of_total: number;
  }>;
}
```

## Error Handling

### Common Error Scenarios
1. **Code Conflicts**
   - Duplicate coupon codes
   - Invalid code patterns
   - Reserved code words

2. **Validation Errors**
   - Invalid discount values
   - Conflicting date ranges
   - Invalid ticket type references

3. **Usage Errors**
   - Exceeding usage limits
   - Expired coupons
   - Ineligible purchases

4. **Business Logic Errors**
   - Stacking incompatible coupons
   - Minimum purchase not met
   - User eligibility failures

## Integration Points

### Dependencies
- Event and calendar must exist
- Ticket types must be valid for restrictions
- User authentication for personalized coupons
- Order processing system integration

### Downstream Effects
- Coupon usage affects pricing calculations
- Analytics impact reporting systems
- User notifications may be triggered
- Revenue tracking requires updates

## Performance Considerations

### Optimization Strategies
- Cache active coupon configurations
- Efficient code uniqueness checking
- Bulk operations for campaign management
- Optimized analytics calculations

### Scale Considerations
- Large numbers of coupons per event
- High-volume coupon usage
- Real-time validation requirements
- Analytics calculation performance

## Testing Strategy

### Unit Tests
- Discount calculation logic
- Usage limit validation
- Code generation uniqueness
- Condition evaluation

### Integration Tests
- Coupon CRUD operations
- Usage tracking accuracy
- Analytics calculation correctness
- Campaign management workflows

### Business Logic Tests
- Complex discount scenarios
- Stacking rule validation
- Eligibility condition checking
- Revenue impact calculations

## Documentation Requirements

### Configuration Guides
- Coupon strategy examples
- Discount type explanations
- Campaign setup patterns
- Analytics interpretation

### API Reference
- Parameter validation rules
- Response format specifications
- Error code definitions
- Usage tracking details

## Definition of Done

### Functional Criteria
- ✅ All 8 user stories implemented and tested
- ✅ Complete coupon lifecycle management
- ✅ Complex promotional scenarios supported
- ✅ Analytics and tracking working

### Quality Criteria
- ✅ Code follows n8n patterns
- ✅ TypeScript interfaces comprehensive
- ✅ Test coverage including edge cases
- ✅ Performance benchmarks met

### Business Criteria
- ✅ Discount calculations accurate
- ✅ Usage tracking reliable
- ✅ Campaign management efficient
- ✅ Revenue impact measurable
