# [PROJ_002] Story 2.2: Lookup Calendar Event

## Story
**As a** workflow developer  
**I want to** check if an event already exists on a calendar  
**So that** I can avoid duplicate event creation and implement conditional logic.

## Acceptance Criteria

### Functional Requirements
- [ ] User can select "Calendar" resource and "Lookup Event" operation
- [ ] User can specify event identifier (URL or API ID)
- [ ] User can specify platform type (external or luma)
- [ ] Node returns event information if found
- [ ] Node returns appropriate response if event not found
- [ ] Support for various event lookup methods

### API Implementation
- **Endpoint:** `GET /public/v1/calendar/lookup-event`
- **Required Parameters:** At least one of the lookup parameters
- **Optional Parameters:** 
  - `platform` - external or luma
  - `url` - Event URL to lookup
  - `event_api_id` - Event API ID to lookup

### Data Structure
```typescript
interface EventLookupResponse {
  found: boolean;
  event?: {
    api_id: string;
    name: string;
    url: string;
    start_at: string;
    end_at?: string;
    timezone: string;
  };
}
```

## Technical Implementation

### Node Configuration
```typescript
{
  displayName: 'Event Lookup Method',
  name: 'lookupMethod',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['calendar'],
      operation: ['lookupEvent']
    }
  },
  options: [
    {
      name: 'By Name',
      value: 'name',
      description: 'Look up event by exact name'
    },
    {
      name: 'By Slug',
      value: 'slug', 
      description: 'Look up event by URL slug'
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
  description: 'The API ID of the calendar to search'
},
{
  displayName: 'Event Name',
  name: 'eventName',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['calendar'],
      operation: ['lookupEvent'],
      lookupMethod: ['name']
    }
  },
  description: 'The exact name of the event to find'
}
```

## Use Cases
1. **Duplicate Prevention:** Check before creating new events
2. **Event Discovery:** Find existing events for further operations
3. **Conditional Workflows:** Branch logic based on event existence
4. **Data Synchronization:** Verify event presence in external systems

## Error Handling
- **401:** Invalid API key or authentication
- **403:** Insufficient permissions for calendar access
- **404:** Calendar not found (different from event not found)
- **429:** Rate limit exceeded

## Dependencies
- Valid Luma API key with calendar read permissions
- Calendar must exist and be accessible

**Priority:** Medium  
**Story Points:** 3  
**Epic:** Epic 2 - Calendar Operations
