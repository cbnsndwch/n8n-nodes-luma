# Story 7.6: Get User Calendars

**As a** workflow developer  
**I want to** retrieve calendars the user owns or follows  
**So that** I can manage their calendar relationships

## Acceptance Criteria
- ✅ Return owned and followed calendars separately
- ✅ Include calendar statistics and activity
- ✅ Support filtering by calendar status
- ✅ Include user's role and permissions for each calendar

## Technical Implementation
```typescript
// Resource: User
// Operation: Get Calendars
// Parameters:
{
  additionalFields: {
    // Filtering Options
    relationship?: 'owned' | 'following' | 'all',
    status?: 'active' | 'inactive' | 'archived',
    visibility?: 'public' | 'private' | 'unlisted',
    
    // Include Options
    includeStats?: boolean,
    includeRecentEvents?: boolean,
    includePermissions?: boolean,
    includeFollowerCount?: boolean,
    
    // Sorting
    sortBy?: 'created_at' | 'last_activity' | 'follower_count' | 'event_count' | 'name',
    sortOrder?: 'asc' | 'desc',
    
    // Pagination
    page?: number,
    limit?: number
  }
}
```

## Test Cases
- Get all user calendars (owned + following)
- Filter by relationship type
- Filter by calendar status
- Include calendar statistics
- Sort by different criteria
- Handle users with many calendars

## Related Endpoints
- `GET /v1/user/calendars` - Get user's calendars (owned/following)

## Dependencies
- Authentication system
- Calendar service
- Permission system
- Statistics service

## Definition of Done
- [ ] Implementation completed
- [ ] Unit tests written and passing
- [ ] Integration tests completed
- [ ] Documentation updated
- [ ] Code review completed
- [ ] Permission filtering implemented
- [ ] Statistics aggregation optimized
