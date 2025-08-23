# [PROJ_002] Epic 1: Core Event Management

## Overview
Implement core event management operations for the Luma Action Node, enabling users to create, read, update, and manage events through n8n workflows.

## Epic Goals
- Enable complete event lifecycle management
- Support all event states (draft, active, past)
- Handle event metadata and configuration
- Provide robust error handling and validation

## API Endpoints Covered

Based on Luma's actual API structure (`/public/v1/{resource}/{action}`):

### Event Operations
- `GET /public/v1/event/get` - Get single event details
- `GET /public/v1/calendar/list-events` - List events in calendar  
- `POST /public/v1/event/create` - Create new event
- `POST /public/v1/event/update` - Update existing event
- `POST /public/v1/event/add-host` - Add host to event

Note: Event deletion is not available in the current API.

## User Stories

This epic contains 5 user stories that implement core event management functionality:

### [Story 1.1: Get Event Details](./story-1.1-get-event-details.md)
Retrieve detailed information about a specific event for use in workflow logic.
- **Priority:** High
- **Story Points:** 3
- **API:** `GET /public/v1/event/get`

### [Story 1.2: List Events in Calendar](./story-1.2-list-events-in-calendar.md)
Retrieve a list of events from a calendar for bulk operations.
- **Priority:** High  
- **Story Points:** 5
- **API:** `GET /public/v1/calendar/list-events`

### [Story 1.3: Create New Event](./story-1.3-create-new-event.md)
Create new events programmatically to automate event creation from external sources.
- **Priority:** High
- **Story Points:** 8
- **API:** `POST /public/v1/event/create`

### [Story 1.4: Update Existing Event](./story-1.4-update-existing-event.md)
Modify existing event details to keep event information current and accurate.
- **Priority:** Medium
- **Story Points:** 5
- **API:** `POST /public/v1/event/update`

### [Story 1.5: Add Event Host](./story-1.5-add-event-host.md)
Add additional hosts to events for collaborative event management.
- **Priority:** Medium
- **Story Points:** 3
- **API:** `POST /public/v1/event/add-host`

**Total Story Points:** 24

---

## Data Models

### Event Object Structure
```typescript
interface LumaEvent {
  event_id: string;
  name: string;
  description?: string;
  start_at: string; // ISO 8601
  duration?: string; // ISO 8601 duration
  end_at?: string; // ISO 8601
  timezone: string;
  location?: {
    type: 'venue' | 'online' | 'tbd';
    name?: string;
    address?: string;
    url?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  calendar_id: string;
  series_id?: string;
  visibility: 'public' | 'private';
  approval_required: boolean;
  capacity?: number;
  guest_count: number;
  state: 'draft' | 'active' | 'past' | 'cancelled';
  created_at: string;
  updated_at: string;
  cover_image_url?: string;
  registration_url: string;
}
```

## Error Handling

### Common Error Scenarios
1. **Authentication Errors** (401)
   - Invalid API key
   - Expired credentials

2. **Authorization Errors** (403)
   - Insufficient permissions
   - Calendar access denied

3. **Validation Errors** (400)
   - Missing required fields
   - Invalid date formats
   - Invalid enum values

4. **Not Found Errors** (404)
   - Event doesn't exist
   - Calendar doesn't exist

5. **Rate Limit Errors** (429)
   - Too many requests
   - Temporary throttling

### Error Response Handling
```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

## Integration Points

### Dependencies
- Calendar must exist before creating events
- Proper timezone handling required
- Date/time validation critical

### Downstream Effects
- Created events can have guests added
- Events can have ticket types configured
- Events can have coupons applied

## Performance Considerations

### Optimization Strategies
- Batch operations where possible
- Implement caching for frequently accessed data
- Use pagination for large result sets
- Minimize API calls through intelligent batching

### Rate Limiting
- Respect Luma's rate limits
- Implement exponential backoff
- Queue operations when needed
- Provide clear feedback on throttling

## Testing Strategy

### Unit Tests
- Parameter validation
- Error handling logic
- Data transformation
- Edge cases

### Integration Tests
- API connectivity
- Authentication flows
- CRUD operations
- Error scenarios

### End-to-End Tests
- Complete workflows
- Real API interactions
- Performance validation
- User acceptance scenarios

## Documentation Requirements

### Code Documentation
- TypeScript interfaces
- Function documentation
- Parameter descriptions
- Example usage

### User Documentation
- Operation guides
- Parameter explanations
- Common use cases
- Troubleshooting guide

## Definition of Done

### Functional Criteria
- ✅ All 5 user stories implemented and tested
- ✅ Error handling for all scenarios
- ✅ Input validation and sanitization
- ✅ API integration working correctly

### Quality Criteria
- ✅ Code follows n8n conventions
- ✅ TypeScript types defined
- ✅ Unit tests with >90% coverage
- ✅ Integration tests passing
- ✅ Documentation complete

### Release Criteria
- ✅ Manual testing completed
- ✅ Performance benchmarks met
- ✅ Security review passed
- ✅ Code review approved
