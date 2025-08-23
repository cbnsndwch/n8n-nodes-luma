# [PROJ_002] Story 2.7: Get Calendar Analytics

## User Story
**As a** calendar administrator  
**I want to** retrieve analytics and metrics for my calendar  
**So that** I can understand calendar performance and usage

## Acceptance Criteria
- ✅ Support calendar ID input (required)
- ✅ Configurable date range filters
- ✅ Multiple metric types available
- ✅ Return structured analytics data

## Technical Implementation
```typescript
// Resource: Calendar
// Operation: Get Analytics
// Parameters:
{
  calendarId: string (required),
  additionalFields: {
    dateRange?: {
      startDate?: string, // ISO 8601
      endDate?: string    // ISO 8601
    },
    metrics?: Array<'events' | 'registrations' | 'attendance' | 'revenue'>,
    granularity?: 'daily' | 'weekly' | 'monthly',
    includeDetails?: boolean
  }
}
```

## API Endpoint
- `GET /public/v1/calendar/get-analytics` - Retrieve calendar analytics

## Test Cases
- Basic analytics retrieval
- Date range filtering
- Specific metrics selection
- Different granularity options
- Detailed vs summary data

## Priority
Medium

## Story Points
3

## Epic
[Epic 2: Calendar Operations](./epic.md)

## GitHub Issue
[Story 2.7: Get Calendar Analytics](https://github.com/cbnsndwch/n8n-nodes-luma/issues/23)
