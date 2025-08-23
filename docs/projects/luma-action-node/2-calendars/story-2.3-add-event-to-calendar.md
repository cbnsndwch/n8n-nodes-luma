# [PROJ_002] Story 2.3: Add Event to Calendar

## User Story
**As a** workflow developer  
**I want to** add existing events to calendars  
**So that** I can organize events across multiple calendars

## Acceptance Criteria
- ✅ Support calendar ID input (required)
- ✅ Support event ID input (required)
- ✅ Handle event association properly
- ✅ Support role specification for the association

## Technical Implementation
```typescript
// Resource: Calendar
// Operation: Add Event
// Parameters:
{
  calendarId: string (required),
  eventId: string (required),
  additionalFields: {
    role?: 'host' | 'co-host' | 'organizer'
  }
}
```

## API Endpoint
- `POST /public/v1/calendar/add-event` - Add event to calendar

## Test Cases
- Successfully add event to calendar
- Handle duplicate associations gracefully
- Validate event and calendar exist
- Role assignment works correctly
- Proper error handling for invalid inputs

## Priority
Medium

## Story Points
3

## Epic
[Epic 2: Calendar Operations](./epic.md)

## GitHub Issue
[Story 2.3: Add Event to Calendar](https://github.com/cbnsndwch/n8n-nodes-luma/issues/19)
