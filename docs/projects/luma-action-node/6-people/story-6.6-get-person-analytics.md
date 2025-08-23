# Story 6.6: Get Person Analytics

**As a** workflow developer  
**I want to** retrieve engagement analytics for a person  
**So that** I can understand their participation patterns and preferences

## Epic Reference
This story is part of [Epic 6: People Management](./epic.md)

## Acceptance Criteria
- ✅ Calculate engagement scores and metrics
- ✅ Analyze event attendance patterns
- ✅ Identify preferences and interests
- ✅ Track behavior changes over time

## Technical Implementation
```typescript
// Resource: People
// Operation: Get Analytics
// Parameters:
{
  personId: string (required),
  additionalFields: {
    // Analysis Period
    analysisFrom?: string, // ISO 8601
    analysisTo?: string,
    
    // Metrics to Include
    includeEngagementScore?: boolean,
    includeAttendancePattern?: boolean,
    includePreferences?: boolean,
    includePeerComparison?: boolean,
    includeGrowthTrends?: boolean,
    
    // Comparison Context
    compareWithCalendar?: string, // compare against calendar average
    compareWithSegment?: string, // compare against similar people
    
    // Detail Level
    granularity?: 'weekly' | 'monthly' | 'quarterly'
  }
}
```

## API Endpoint
- `GET /v1/person/analytics`

## Test Cases
- Calculate engagement scores correctly
- Identify attendance patterns
- Extract preference insights
- Compare against benchmarks
- Track changes over time
- Handle insufficient data gracefully

## Priority
Low

## Story Points
8

## Dependencies
- Person must exist
- Sufficient historical data
- Analytics calculation engine

## Definition of Done
- [ ] Implementation follows n8n node patterns
- [ ] Input validation and error handling
- [ ] TypeScript interfaces defined
- [ ] Unit tests written and passing
- [ ] Integration tests with real API
- [ ] Documentation updated
