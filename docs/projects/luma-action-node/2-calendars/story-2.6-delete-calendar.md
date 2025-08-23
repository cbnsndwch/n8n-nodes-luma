# [PROJ_002] Story 2.6: Delete Calendar

## User Story
**As a** calendar administrator  
**I want to** delete a calendar permanently  
**So that** I can remove unused or obsolete calendars

## Acceptance Criteria
- ✅ Support calendar ID input (required)
- ✅ Include confirmation mechanism
- ✅ Handle associated events appropriately
- ✅ Return deletion confirmation

## Technical Implementation
```typescript
// Resource: Calendar
// Operation: Delete
// Parameters:
{
  calendarId: string (required),
  additionalFields: {
    forceDelete?: boolean,
    archiveEvents?: boolean,
    transferEventsTo?: string, // target calendar ID
    confirmDeletion?: boolean // safety check
  }
}
```

## API Endpoint
- `DELETE /public/v1/calendar/delete` - Delete calendar permanently

## Test Cases
- Delete empty calendar
- Handle calendar with active events
- Force deletion with archive option
- Transfer events to another calendar
- Confirmation requirement validation

## Priority
Low

## Story Points
5

## Epic
[Epic 2: Calendar Operations](./epic.md)

## GitHub Issue
[Story 2.6: Delete Calendar](https://github.com/cbnsndwch/n8n-nodes-luma/issues/22)
