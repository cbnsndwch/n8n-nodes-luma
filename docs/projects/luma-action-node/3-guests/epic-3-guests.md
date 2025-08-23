# [PROJ_002] Epic 3: Guest & RSVP Management

## Overview
Implement comprehensive guest and RSVP management operations for the Luma Action Node, enabling users to manage event registrations, approvals, and attendee data through n8n workflows.

## Epic Goals
- Enable complete guest lifecycle management
- Support RSVP approval workflows  
- Handle guest data and communication
- Provide bulk guest operations

## API Endpoints Covered

Based on Luma's actual API structure (`/public/v1/event/{action}`):

### Guest Operations
- `GET /public/v1/event/get-guest` - Get single guest details
- `GET /public/v1/event/get-guests` - List event guests with filtering
- `POST /public/v1/event/add-guests` - Add/register guests to event
- `POST /public/v1/event/update-guest-status` - Update guest approval status
- `POST /public/v1/event/send-invites` - Send invitations to guests

## User Stories

This epic contains 8 user stories that implement comprehensive guest and RSVP management functionality:

### [Story 3.1: List Event Guests](./story-3.1-list-event-guests.md)
Retrieve all guests for a specific event to manage attendee lists and communications.
- **Priority:** High
- **Story Points:** 5
- **API:** `GET /public/v1/event/get-guests`

### [Story 3.2: Get Guest Details](./story-3.2-get-guest-details.md)
Retrieve detailed information about a specific guest for individual registration data access.
- **Priority:** Medium
- **Story Points:** 3
- **API:** `GET /public/v1/event/get-guest`

### [Story 3.3: Register Guest for Event](./story-3.3-register-guest-for-event.md)
Register guests for events programmatically to automate registration processes.
- **Priority:** High
- **Story Points:** 8
- **API:** `POST /public/v1/event/add-guests`

### [Story 3.4: Update Guest Status](./story-3.4-update-guest-status.md)
Modify guest approval status and other guest properties.
- **Priority:** High
- **Story Points:** 5
- **API:** `POST /public/v1/event/update-guest-status`

### [Story 3.5: Approve Guest Registration](./story-3.5-approve-guest-registration.md)
Approve pending guest registrations to automate approval workflows.
- **Priority:** High
- **Story Points:** 5
- **API:** `POST /v1/guest/approve`

### [Story 3.6: Reject Guest Registration](./story-3.6-reject-guest-registration.md)
Reject guest registrations that don't meet criteria to maintain event quality.
- **Priority:** Medium
- **Story Points:** 3
- **API:** `POST /v1/guest/reject`

### [Story 3.7: Cancel Guest Registration](./story-3.7-cancel-guest-registration.md)
Cancel guest registrations when needed to handle cancellations and free up capacity.
- **Priority:** Low
- **Story Points:** 3
- **API:** `POST /v1/guest/cancel`

### [Story 3.8: Check In Guest](./story-3.8-check-in-guest.md)
Check in guests at event time to track attendance and manage event logistics.
- **Priority:** Medium
- **Story Points:** 5
- **API:** `POST /v1/guest/check-in`

**Total Story Points:** 37

---

## Data Models

### Guest Object Structure
```typescript
interface LumaGuest {
  guest_id: string;
  person_id: string;
  event_id: string;
  
  // Personal Information
  name: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  job_title?: string;
  phone?: string;
  
  // Registration Status
  approval_status: 'approved' | 'pending' | 'rejected';
  registration_status: 'confirmed' | 'cancelled' | 'waitlisted';
  attendance_status: 'registered' | 'checked_in' | 'attended' | 'no_show';
  
  // Timestamps
  registered_at: string;
  approved_at?: string;
  checked_in_at?: string;
  cancelled_at?: string;
  
  // Event Details
  ticket_type_id?: string;
  ticket_type_name?: string;
  
  // Additional Data
  notes?: string;
  custom_fields?: Record<string, any>;
  
  // Admin Information
  created_by?: string;
  registration_source?: string;
  approval_notes?: string;
  cancellation_reason?: string;
}
```

### Registration Response Structure
```typescript
interface RegistrationResponse {
  guest_id: string;
  registration_status: 'confirmed' | 'pending' | 'waitlisted';
  confirmation_code?: string;
  ticket_info?: {
    ticket_type_id: string;
    ticket_type_name: string;
    price?: number;
  };
  next_steps?: string[];
  requires_approval: boolean;
}
```

## Error Handling

### Common Error Scenarios
1. **Registration Errors**
   - Event at capacity
   - Duplicate registration
   - Invalid ticket type
   - Registration closed

2. **Approval Errors**
   - Guest already processed
   - Invalid approval status
   - Insufficient permissions

3. **Data Validation Errors**
   - Invalid email format
   - Missing required fields
   - Invalid custom field values

4. **State Transition Errors**
   - Invalid status changes
   - Already checked in
   - Cancelled registration operations

## Integration Points

### Dependencies
- Event must exist and be active
- Ticket types must be configured
- Email validation and formatting
- Timezone handling for timestamps

### Downstream Effects
- Guest operations affect event capacity
- Approvals trigger notification workflows
- Check-ins update attendance statistics
- Cancellations may affect waitlists

## Performance Considerations

### Optimization Strategies
- Batch guest operations where possible
- Efficient pagination for large guest lists
- Cache frequently accessed guest data
- Optimize bulk approval/rejection operations

### Scale Considerations
- Large events may have thousands of guests
- Real-time check-in operations need to be fast
- Bulk operations should provide progress feedback
- Rate limiting for high-volume operations

## Testing Strategy

### Unit Tests
- Registration validation logic
- Status transition rules
- Notification triggering
- Data transformation

### Integration Tests
- End-to-end registration flow
- Approval workflow automation
- Check-in process validation
- Bulk operation performance

### Load Tests
- High-volume registration handling
- Concurrent check-in operations
- Large guest list pagination
- Bulk approval performance

## Documentation Requirements

### Operation Guides
- Registration workflow setup
- Approval automation patterns
- Check-in integration examples
- Bulk operation best practices

### Data Format Documentation
- Guest object schema
- Custom field specifications
- Status value definitions
- Error code references

## Definition of Done

### Functional Criteria
- ✅ All 8 user stories implemented and tested
- ✅ Complete guest lifecycle support
- ✅ Bulk operations working efficiently
- ✅ Error scenarios handled gracefully

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
