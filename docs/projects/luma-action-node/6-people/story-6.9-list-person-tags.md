# Story 6.9: List Person Tags

**As a** workflow developer  
**I want to** retrieve all tags assigned to a person  
**So that** I can understand their categorization and segmentation

## Epic Reference
This story is part of [Epic 6: People Management](./epic.md)

## Acceptance Criteria
- ✅ Support person ID input (required)
- ✅ Return all tags with metadata
- ✅ Include tag assignment history
- ✅ Support tag filtering and sorting

## Technical Implementation
```typescript
// Resource: People
// Operation: List Tags
// Parameters:
{
  personId: string (required),
  additionalFields: {
    includeTagMetadata?: boolean,
    includeAssignmentHistory?: boolean,
    includeTagStats?: boolean, // how many people have each tag
    
    // Filtering
    tagCategory?: string, // filter by tag category
    assignedBy?: string, // filter by who assigned
    assignedSince?: string, // filter by assignment date
    activeOnly?: boolean, // exclude expired tags
    
    // Sorting
    sortBy?: 'tag_name' | 'assigned_date' | 'tag_category',
    sortOrder?: 'asc' | 'desc'
  }
}
```

## API Endpoint
- `GET /v1/person/tags/list`

## Test Cases
- List all person tags
- Include tag metadata and history
- Filter by tag categories
- Filter by assignment dates
- Sort by different criteria
- Handle people with no tags

## Priority
Low

## Story Points
2

## Dependencies
- Person must exist
- Tag management system
- Proper authentication and permissions

## Definition of Done
- [ ] Implementation follows n8n node patterns
- [ ] Input validation and error handling
- [ ] TypeScript interfaces defined
- [ ] Unit tests written and passing
- [ ] Integration tests with real API
- [ ] Documentation updated
