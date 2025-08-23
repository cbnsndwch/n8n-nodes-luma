# [PROJ_002] Story 2.1: List Calendar Events

## Story
**As a** workflow developer  
**I want to** retrieve a list of events managed by a calendar  
**So that** I can process calendar events in bulk or implement event discovery workflows.

## Acceptance Criteria

### Functional Requirements
- [ ] User can select "Calendar" resource and "List Events" operation
- [ ] User can specify calendar API ID
- [ ] User can configure optional filtering parameters
- [ ] Node returns paginated list of calendar events
- [ ] Each event includes complete metadata structure

### API Implementation
- **Endpoint:** `GET /public/v1/calendar/list-events`
- **Required Parameters:** `calendar_api_id`
- **Optional Parameters:** `pagination_limit`, `pagination_cursor`

### Data Structure
```typescript
interface CalendarEventListResponse {
  has_more: boolean;
  next_cursor?: string;
  entries: CalendarEvent[];
}

interface CalendarEvent {
  api_id: string;
  name: string;
  description?: string;
  start_at: string; // ISO 8601
  end_at?: string; // ISO 8601
  timezone: string;
  url: string;
  event_type: string;
  geo_latitude?: number;
  geo_longitude?: number;
  geo_address_info?: {
    address: string;
    city: string;
    country: string;
  };
  featured_image?: {
    url: string;
    alt?: string;
  };
}
```

## Technical Implementation

### Node Configuration
```typescript
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['calendar']
    }
  },
  options: [
    {
      name: 'List Events',
      value: 'listEvents',
      description: 'List events managed by a calendar'
    }
  ]
}
```

### Parameters
```typescript
{
  displayName: 'Calendar API ID',
  name: 'calendarApiId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['calendar'],
      operation: ['listEvents']
    }
  },
  description: 'The API ID of the calendar'
}
```

## Error Handling
- **401:** Invalid API key or authentication
- **403:** Insufficient permissions for calendar access
- **404:** Calendar not found
- **429:** Rate limit exceeded

## Dependencies
- Valid Luma API key with calendar access permissions
- Calendar must exist and be accessible

**Priority:** High  
**Story Points:** 5  
**Epic:** Epic 2 - Calendar Operations
