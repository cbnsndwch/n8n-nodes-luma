# [PROJ_002] Story 2.2: List User Calendars

## User Story
**As a** workflow developer  
**I want to** retrieve all calendars accessible to the authenticated user  
**So that** I can programmatically discover and work with available calendars

## Acceptance Criteria
- ✅ Return list of all accessible calendars
- ✅ Include calendar metadata and permissions
- ✅ Support filtering by calendar type/status
- ✅ Support pagination for large lists

## Technical Implementation
```typescript
// Resource: Calendar
// Operation: List
// Parameters:
{
  additionalFields: {
    includeArchived?: boolean,
    calendarType?: 'personal' | 'organization' | 'shared',
    limit?: number,
    after?: string
  }
}
```

## Test Cases
- List all calendars for user
- Filter by calendar type
- Pagination works correctly
- Include archived calendars option
- Empty list for new user

## API Endpoint
- `GET /v1/user/list-calendars`

## Priority
High

## Story Points
5

## Epic
[Epic 2: Calendar Operations](./epic.md)
