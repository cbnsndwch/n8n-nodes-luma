# [PROJ_002] Epic 4: Ticket Management

## Overview
Implement comprehensive ticket type and pricing management operations for the Luma Action Node, enabling users to configure event pricing, manage ticket availability, and handle ticket-related operations through n8n workflows.

## Epic Goals
- Enable complete ticket type lifecycle management
- Support dynamic pricing and availability control
- Handle ticket inventory and capacity limits
- Provide ticket analytics and reporting

## API Endpoints Covered

### Ticket Operations
- `GET /v1/event/ticket-types/list` - List ticket types for event
- `GET /v1/event/ticket-types/get` - Get single ticket type details
- `POST /v1/event/ticket-types/create` - Create new ticket type
- `POST /v1/event/ticket-types/update` - Update ticket type configuration
- `POST /v1/event/ticket-types/delete` - Delete ticket type
- `GET /v1/event/ticket-types/analytics` - Get ticket sales analytics
- `POST /v1/event/ticket-types/bulk-update` - Bulk update ticket types

## User Stories

This epic contains 7 user stories that implement comprehensive ticket management functionality:

### [Story 4.1: List Event Ticket Types](./story-4.1-list-event-ticket-types.md)
Retrieve all ticket types for a specific event to understand pricing structure and availability.
- **Priority:** High
- **Story Points:** 3
- **API:** `GET /v1/event/ticket-types/list`

### [Story 4.2: Get Ticket Type Details](./story-4.2-get-ticket-type-details.md)
Retrieve detailed information about a specific ticket type for configuration access.
- **Priority:** High
- **Story Points:** 3
- **API:** `GET /v1/event/ticket-types/get`

### [Story 4.3: Create New Ticket Type](./story-4.3-create-new-ticket-type.md)
Create new ticket types programmatically to automate event pricing setup.
- **Priority:** High
- **Story Points:** 8
- **API:** `POST /v1/event/ticket-types/create`

### [Story 4.4: Update Ticket Type Configuration](./story-4.4-update-ticket-type-configuration.md)
Modify existing ticket type settings to adjust pricing and availability.
- **Priority:** Medium
- **Story Points:** 5
- **API:** `POST /v1/event/ticket-types/update`

### [Story 4.5: Delete Ticket Type](./story-4.5-delete-ticket-type.md)
Remove ticket types that are no longer needed to clean up pricing structure.
- **Priority:** Low
- **Story Points:** 3
- **API:** `POST /v1/event/ticket-types/delete`

### [Story 4.6: Get Ticket Analytics](./story-4.6-get-ticket-analytics.md)
Retrieve sales analytics for ticket types to analyze performance and optimize pricing.
- **Priority:** Medium
- **Story Points:** 5
- **API:** `GET /v1/event/ticket-types/analytics`

### [Story 4.7: Bulk Update Ticket Types](./story-4.7-bulk-update-ticket-types.md)
Update multiple ticket types simultaneously to efficiently manage pricing across types.
- **Priority:** Medium
- **Story Points:** 8
- **API:** `POST /v1/event/ticket-types/bulk-update`

**Total Story Points:** 35

---

## Data Models

### Ticket Type Object Structure
```typescript
interface LumaTicketType {
  ticket_type_id: string;
  event_id: string;
  name: string;
  description?: string;
  
  // Pricing
  price: number; // in cents
  currency: string;
  
  // Availability
  capacity?: number; // null = unlimited
  sold_count: number;
  available_count?: number;
  
  // Purchase Limits
  min_quantity: number;
  max_quantity: number;
  
  // Sale Period
  sale_start_at?: string;
  sale_end_at?: string;
  
  // Configuration
  is_hidden: boolean;
  requires_approval: boolean;
  allows_waitlist: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Pricing Tiers
  pricing_tiers?: Array<{
    tier_id: string;
    name: string;
    price: number;
    start_at: string;
    end_at?: string;
    capacity?: number;
    sold_count: number;
  }>;
  
  // Discount Rules
  discount_rules?: Array<{
    rule_id: string;
    type: 'early_bird' | 'bulk' | 'promo_code';
    name: string;
    value: number;
    value_type: 'percentage' | 'fixed';
    min_quantity?: number;
    max_uses?: number;
    used_count: number;
    valid_until?: string;
    promo_code?: string;
  }>;
  
  // Analytics (optional)
  analytics?: {
    total_revenue: number;
    conversion_rate: number;
    avg_purchase_quantity: number;
    peak_sales_day?: string;
    refund_count: number;
    refund_amount: number;
  };
}
```

### Ticket Analytics Response
```typescript
interface TicketAnalytics {
  event_id: string;
  ticket_type_id?: string;
  date_from: string;
  date_to: string;
  
  // Overall Metrics
  total_sales: number;
  total_revenue: number;
  total_refunds: number;
  refund_amount: number;
  net_revenue: number;
  
  // Performance Metrics
  conversion_rate: number;
  avg_order_value: number;
  avg_quantity_per_order: number;
  
  // Time-based Data
  daily_sales?: Array<{
    date: string;
    sales_count: number;
    revenue: number;
  }>;
  
  // Ticket Type Breakdown
  by_ticket_type?: Array<{
    ticket_type_id: string;
    ticket_type_name: string;
    sales_count: number;
    revenue: number;
    percentage_of_total: number;
  }>;
}
```

## Error Handling

### Common Error Scenarios
1. **Capacity Errors**
   - Exceeding event capacity
   - Reducing capacity below sold tickets
   - Invalid capacity configurations

2. **Pricing Errors**
   - Negative prices
   - Invalid currency
   - Pricing tier conflicts

3. **Date/Time Errors**
   - Sale end before sale start
   - Past dates for future sales
   - Timezone mismatches

4. **Business Logic Errors**
   - Deleting ticket type with active sales
   - Invalid discount combinations
   - Min/max quantity conflicts

## Integration Points

### Dependencies
- Event must exist and be configurable
- Currency and pricing validation
- Date/time handling with timezones
- Capacity calculations with existing sales

### Downstream Effects
- Ticket changes affect registration options
- Price changes may impact existing sales
- Capacity changes affect waitlist processing
- Analytics impact reporting and insights

## Performance Considerations

### Optimization Strategies
- Cache ticket type configurations
- Efficient calculation of availability
- Bulk operations for multiple updates
- Optimized analytics queries

### Scale Considerations
- Events may have many ticket types
- High-volume sales require fast availability checks
- Analytics calculations may be expensive
- Real-time capacity updates needed

## Testing Strategy

### Unit Tests
- Pricing calculation logic
- Capacity validation
- Date/time validation
- Discount rule application

### Integration Tests
- Ticket type CRUD operations
- Sales impact validation
- Analytics calculation accuracy
- Bulk operation performance

### Business Logic Tests
- Complex pricing scenarios
- Capacity edge cases
- Discount combination validation
- State transition rules

## Documentation Requirements

### Configuration Guides
- Ticket type setup patterns
- Pricing strategy examples
- Discount rule configuration
- Analytics interpretation

### API Reference
- Parameter validation rules
- Response format specifications
- Error code definitions
- Rate limiting information

## Definition of Done

### Functional Criteria
- ✅ All 7 user stories implemented and tested
- ✅ Complete ticket lifecycle management
- ✅ Complex pricing scenarios supported
- ✅ Analytics and reporting working

### Quality Criteria
- ✅ Code follows n8n patterns
- ✅ TypeScript interfaces comprehensive
- ✅ Test coverage including edge cases
- ✅ Performance benchmarks met

### Business Criteria
- ✅ Pricing calculations accurate
- ✅ Capacity management robust
- ✅ Analytics data reliable
- ✅ Integration scenarios validated
