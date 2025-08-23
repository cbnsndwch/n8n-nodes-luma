# [PROJ_002] Epic 2: Calendar Operations

## Overview
Implement calendar management operations for the Luma Action Node, enabling users to manage calendars, calendar settings, and calendar-wide operations through n8n workflows.

## Epic Goals
- Enable calendar lifecycle management
- Support calendar configuration and settings
- Handle calendar-wide operations (bulk actions)
- Provide calendar discovery and listing capabilities

## API Endpoints Covered

### Calendar Operations
- `GET /v1/calendar/get` - Get calendar details
- `GET /v1/user/list-calendars` - List user's calendars
- `POST /v1/calendar/create` - Create new calendar  
- `POST /v1/calendar/update` - Update calendar settings
- `POST /v1/calendar/delete` - Delete calendar
- `GET /v1/calendar/list-people` - List people in calendar
- `GET /v1/calendar/list-coupons` - List calendar coupons

## User Stories

This epic contains 7 user stories that implement calendar management functionality:

### [Story 2.1: Get Calendar Details](./story-2.1-get-calendar-details.md)
Retrieve detailed information about a specific calendar for configuration access.
- **Priority:** High
- **Story Points:** 3
- **API:** `GET /v1/calendar/get`

### [Story 2.2: List User Calendars](./story-2.2-list-user-calendars.md)
Retrieve all calendars accessible to the authenticated user for discovery.
- **Priority:** High
- **Story Points:** 5
- **API:** `GET /v1/user/list-calendars`

### [Story 2.3: Create New Calendar](./story-2.3-create-new-calendar.md)
Create new calendars programmatically to set up event organization structures.
- **Priority:** High
- **Story Points:** 8
- **API:** `POST /v1/calendar/create`

### [Story 2.4: Update Calendar Settings](./story-2.4-update-calendar-settings.md)
Modify calendar configuration and settings for maintenance and optimization.
- **Priority:** Medium
- **Story Points:** 5
- **API:** `POST /v1/calendar/update`

### [Story 2.5: Delete Calendar](./story-2.5-delete-calendar.md)
Remove calendars that are no longer needed to maintain clean organization.
- **Priority:** Low
- **Story Points:** 3
- **API:** `POST /v1/calendar/delete`

### [Story 2.6: List Calendar People](./story-2.6-list-calendar-people.md)
Retrieve all people associated with a calendar for relationship management.
- **Priority:** Medium
- **Story Points:** 4
- **API:** `GET /v1/calendar/list-people`

### [Story 2.7: List Calendar Coupons](./story-2.7-list-calendar-coupons.md)
Retrieve all coupons available for a calendar for promotional campaign management.
- **Priority:** Low
- **Story Points:** 3
- **API:** `GET /v1/calendar/list-coupons`

**Total Story Points:** 31

---

## Data Models

### Calendar Object Structure
```typescript
interface LumaCalendar {
  calendar_id: string;
  name: string;
  description?: string;
  url: string; // custom URL slug
  timezone: string;
  visibility: 'public' | 'private';
  default_approval_required: boolean;
  created_at: string;
  updated_at: string;
  
  // Statistics (optional)
  stats?: {
    event_count: number;
    member_count: number;
    follower_count: number;
    total_registrations: number;
  };
  
  // Theme settings
  theme: {
    primary_color: string;
    logo_url?: string;
    banner_url?: string;
  };
  
  // Social links
  social_links: {
    website?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  
  // Permissions for current user
  permissions: {
    can_edit: boolean;
    can_delete: boolean;
    can_create_events: boolean;
    can_manage_members: boolean;
  };
}
```

### Calendar Person Object
```typescript
interface CalendarPerson {
  person_id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'follower';
  status: 'active' | 'inactive';
  joined_at: string;
  last_activity_at?: string;
  
  // Activity stats (optional)
  activity?: {
    events_attended: number;
    events_hosted: number;
    last_event_at?: string;
  };
}
```

## Error Handling

### Common Error Scenarios
1. **Authentication Errors** (401)
   - Invalid API key
   - Expired credentials

2. **Authorization Errors** (403)
   - Insufficient calendar permissions
   - Cannot access private calendar

3. **Validation Errors** (400)
   - Invalid timezone
   - Invalid URL slug format
   - Missing required fields

4. **Conflict Errors** (409)
   - URL slug already taken
   - Calendar name conflicts

5. **Resource Limits** (429)
   - Calendar creation limits exceeded
   - Rate limiting

## Integration Points

### Dependencies
- User must have appropriate permissions
- Timezone validation against standard zones
- URL slug availability checking

### Downstream Effects
- Calendar changes affect all contained events
- Member changes affect access permissions
- Theme changes affect public calendar appearance

## Performance Considerations

### Optimization Strategies
- Cache calendar metadata
- Batch calendar operations
- Use efficient pagination
- Minimize redundant API calls

### Data Volume Considerations
- Large calendars may have many events/people
- Pagination required for member lists
- Statistics computation may be expensive

## Testing Strategy

### Unit Tests
- Parameter validation
- Permission checking
- Data transformation
- Error scenarios

### Integration Tests
- Calendar CRUD operations
- Permission enforcement
- Cascade operations
- Statistical calculations

## Documentation Requirements

### API Documentation
- Parameter descriptions
- Response schemas
- Error codes
- Rate limits

### Usage Examples
- Common workflows
- Best practices
- Integration patterns
- Troubleshooting

## Definition of Done

### Functional Criteria
- ✅ All 7 user stories implemented
- ✅ CRUD operations working
- ✅ Permission handling correct
- ✅ Error cases covered

### Quality Criteria
- ✅ Code follows n8n patterns
- ✅ TypeScript types complete
- ✅ Test coverage >90%
- ✅ Documentation updated

### Integration Criteria
- ✅ Works with existing nodes
- ✅ Proper error propagation
- ✅ Performance acceptable
- ✅ Security validated
