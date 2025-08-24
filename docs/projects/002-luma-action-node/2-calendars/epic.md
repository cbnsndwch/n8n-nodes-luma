# [PROJ_002] Epic 2: Calendar Operations

## Overview
Implement calendar management operations for the Luma Action Node, enabling users to list events, manage people, handle coupons, and perform calendar-specific operations through n8n workflows.

## Epic Goals
- Enable calendar-level event management and discovery
- Support calendar people and tag management
- Handle calendar coupon operations
- Provide calendar lookup and import functionality

## API Endpoints Covered

Based on Luma's actual API structure (`/public/v1/calendar/{action}`):

### Calendar Operations
- `GET /public/v1/calendar/list-events` - List events in a calendar
- `GET /public/v1/calendar/lookup-event` - Check if event exists in calendar
- `POST /public/v1/calendar/add-event` - Add event to calendar
- `GET /public/v1/calendar/list-people` - List people in calendar
- `POST /public/v1/calendar/import-people` - Import people to calendar
- `GET /public/v1/calendar/list-person-tags` - List person tags
- `POST /public/v1/calendar/create-person-tag` - Create person tag
- `PUT /public/v1/calendar/update-person-tag` - Update person tag
- `DELETE /public/v1/calendar/delete-person-tag` - Delete person tag
- `GET /public/v1/calendar/coupons` - List calendar coupons
- `POST /public/v1/calendar/coupons/create` - Create calendar coupon
- `PUT /public/v1/calendar/coupons/update` - Update calendar coupon

## User Stories

This epic contains 12 user stories that implement calendar management functionality:

### [Story 2.1: List Calendar Events](./story-2.1-list-calendar-events.md)
Retrieve a list of events managed by a calendar.
- **Priority:** High
- **Story Points:** 5
- **API:** `GET /public/v1/calendar/list-events`

### [Story 2.2: Lookup Calendar Event](./story-2.2-lookup-calendar-event.md)
Check if an event already exists on the calendar.
- **Priority:** Medium
- **Story Points:** 3
- **API:** `GET /public/v1/calendar/lookup-event`

### [Story 2.3: Add Event to Calendar](./story-2.3-add-event-to-calendar.md)
Add an event to a calendar programmatically.
- **Priority:** High
- **Story Points:** 8
- **API:** `POST /public/v1/calendar/add-event`

### [Story 2.4: Import People to Calendar](./story-2.4-import-people-to-calendar.md)
Import and manage people associated with a calendar.
- **Priority:** Medium
- **Story Points:** 5
- **API:** `POST /public/v1/calendar/import-people`

### [Story 2.5: List Calendar People](./story-2.5-list-calendar-people.md)
Retrieve a list of people associated with a calendar.
- **Priority:** Medium
- **Story Points:** 5
- **API:** `GET /public/v1/calendar/list-people`

### [Story 2.6: List Person Tags](./story-2.6-list-person-tags.md)
Retrieve person tags for calendar organization.
- **Priority:** Low
- **Story Points:** 3
- **API:** `GET /public/v1/calendar/list-person-tags`

### [Story 2.7: Create Person Tag](./story-2.7-create-person-tag.md)
Create new person tags for calendar organization.
- **Priority:** Low
- **Story Points:** 3
- **API:** `POST /public/v1/calendar/create-person-tag`

### [Story 2.8: Update Person Tag](./story-2.8-update-person-tag.md)
Update existing person tags for calendar organization.
- **Priority:** Low
- **Story Points:** 3
- **API:** `PUT /public/v1/calendar/update-person-tag`

### [Story 2.9: Delete Person Tag](./story-2.9-delete-person-tag.md)
Delete person tags from calendar.
- **Priority:** Low
- **Story Points:** 3
- **API:** `DELETE /public/v1/calendar/delete-person-tag`

### [Story 2.10: List Calendar Coupons](./story-2.10-list-calendar-coupons.md)
Retrieve list of coupons for calendar events.
- **Priority:** Medium
- **Story Points:** 3
- **API:** `GET /public/v1/calendar/coupons`

### [Story 2.11: Create Calendar Coupon](./story-2.11-create-calendar-coupon.md)
Create new coupons for calendar events.
- **Priority:** Medium
- **Story Points:** 5
- **API:** `POST /public/v1/calendar/coupons/create`

### [Story 2.12: Update Calendar Coupon](./story-2.12-update-calendar-coupon.md)
Update existing coupons for calendar events.
- **Priority:** Medium
- **Story Points:** 5
- **API:** `PUT /public/v1/calendar/coupons/update`

**Total Story Points:** 51

---

## Data Models

### Calendar Event List Structure
```typescript
interface CalendarEvent {
  api_id: string;
  name: string;
  description?: string;
  start_at: string; // ISO 8601
  end_at?: string; // ISO 8601
  geo_latitude?: number;
  geo_longitude?: number;
  geo_address_info?: {
    address: string;
    city: string;
    country: string;
  };
  url: string;
  timezone: string;
  event_type: string;
  featured_image?: {
    url: string;
    alt?: string;
  };
}
```

### Calendar Person Structure
```typescript
interface CalendarPerson {
  api_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  company?: string;
  job_title?: string;
  linkedin_url?: string;
  twitter_url?: string;
  website_url?: string;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}
```

### Person Tag Structure
```typescript
interface PersonTag {
  api_id: string;
  name: string;
  color?: string;
  description?: string;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}
```

### Calendar Coupon Structure
```typescript
interface CalendarCoupon {
  api_id: string;
  name: string;
  code: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  max_uses?: number;
  current_uses: number;
  expires_at?: string; // ISO 8601
  is_active: boolean;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}
```

## Error Handling

### Common Error Scenarios
1. **Authentication Errors** (401)
   - Invalid API key
   - Expired credentials

2. **Authorization Errors** (403)
   - Insufficient calendar permissions
   - Cannot access private calendar data

3. **Validation Errors** (400)
   - Invalid email format in people import
   - Missing required fields
   - Invalid coupon configuration

4. **Resource Errors** (404)
   - Calendar not found
   - Event not found in calendar
   - Person tag not found

5. **Conflict Errors** (409)
   - Duplicate person tag name
   - Coupon code already exists

## Integration Points

### Dependencies
- Calendar must exist and be accessible
- Proper permission checking for calendar operations
- Event validation for calendar association

### Downstream Effects
- Calendar events affect event discovery
- People management affects event registration
- Coupon operations affect event pricing

## Performance Considerations

### Optimization Strategies
- Efficient pagination for large calendar event lists
- Batch people import operations
- Cache calendar metadata for repeated operations
- Optimize coupon validation for high-frequency usage

### Scale Considerations
- Large calendars may have thousands of events
- People lists can be extensive
- Coupon usage tracking for popular events

---

## Technical Implementation Notes

### Calendar API Integration
- All calendar operations require calendar-level authentication
- Event listings support filtering and pagination
- People management includes bulk import capabilities
- Coupon operations support both create/read/update operations

### Data Synchronization
- Calendar event data should be refreshed periodically
- People information may change frequently
- Coupon usage requires real-time validation

**Dependencies:** Epic 1 (Event Operations) should be completed first as calendar operations often reference events.
- Rate limiting for bulk operations
- Efficient status update operations

## Testing Strategy

### Unit Tests
- Guest data validation
- Status transition logic
- Email format validation
- Permission checking

### Integration Tests
- End-to-end guest registration flow
- Invitation workflow validation
- Status update operations
- Guest list filtering and pagination

## Documentation Requirements

### Operation Guides
- Guest registration workflows
- Invitation management patterns
- Status update automation
- Bulk guest operations

### API Reference
- Guest object schema
- Status value definitions
- Error code references
- Rate limiting information

## Definition of Done

### Functional Criteria
- ✅ All 5 user stories implemented and tested
- ✅ Complete guest lifecycle support
- ✅ Proper status management
- ✅ Invitation workflows working

### Quality Criteria
- ✅ Code follows n8n conventions
- ✅ TypeScript interfaces complete
- ✅ Comprehensive test coverage
- ✅ Performance benchmarks met

### Integration Criteria
- ✅ Event integration working
- ✅ Notification systems connected
- ✅ Capacity management accurate
- ✅ Data consistency maintained
