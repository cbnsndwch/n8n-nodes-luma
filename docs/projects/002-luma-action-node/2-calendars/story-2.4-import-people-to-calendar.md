# [PROJ_002] Story 2.4: Import People to Calendar

## User Story
**As a** workflow developer  
**I want to** import multiple people to a calendar in bulk  
**So that** I can efficiently manage large attendee lists

## Acceptance Criteria
- ✅ Support calendar ID input (required)
- ✅ Accept CSV or structured data input
- ✅ Handle duplicate email detection
- ✅ Return import results with success/failure counts

## Technical Implementation
```typescript
// Resource: Calendar
// Operation: Import People
// Parameters:
{
  calendarId: string (required),
  people: Array<{
    email: string (required),
    name?: string,
    role?: 'admin' | 'member' | 'follower',
    tags?: string[]
  }> (required),
  additionalFields: {
    skipDuplicates?: boolean,
    notifyUsers?: boolean,
    defaultRole?: 'admin' | 'member' | 'follower'
  }
}
```

## API Endpoint
- `POST /public/v1/calendar/import-people` - Import people to calendar

## Test Cases
- Import valid people list
- Handle duplicate emails
- Mixed valid/invalid entries
- Return detailed import results
- Notify users option works correctly

## Priority
Medium

## Story Points
5

## Epic
[Epic 2: Calendar Operations](./epic.md)

## GitHub Issue
[Story 2.4: Import People to Calendar](https://github.com/cbnsndwch/n8n-nodes-luma/issues/20)
