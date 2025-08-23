# [PROJ_002] Story 2.5: Update Calendar Settings

## User Story
**As a** calendar administrator  
**I want to** update calendar settings and configuration  
**So that** I can maintain current calendar properties

## Acceptance Criteria
- ✅ Support calendar ID input (required)
- ✅ Accept partial update data
- ✅ Validate setting combinations
- ✅ Return updated calendar configuration

## Technical Implementation
```typescript
// Resource: Calendar
// Operation: Update Settings
// Parameters:
{
  calendarId: string (required),
  updateFields: {
    name?: string,
    description?: string,
    timezone?: string,
    visibility?: 'public' | 'private' | 'unlisted',
    requireApproval?: boolean,
    allowGuests?: boolean,
    settings?: {
      emailNotifications?: boolean,
      smsNotifications?: boolean,
      defaultEventDuration?: number,
      maxCapacity?: number
    }
  }
}
```

## API Endpoint
- `PATCH /public/v1/calendar/update-settings` - Update calendar settings

## Test Cases
- Update individual settings
- Partial configuration updates
- Invalid setting combinations
- Timezone validation
- Settings persistence verification

## Priority
Medium

## Story Points
3

## Epic
[Epic 2: Calendar Operations](./epic.md)

## GitHub Issue
[Story 2.5: Update Calendar Settings](https://github.com/cbnsndwch/n8n-nodes-luma/issues/21)
