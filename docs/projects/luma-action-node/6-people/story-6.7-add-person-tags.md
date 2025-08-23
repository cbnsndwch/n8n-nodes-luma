# Story 6.7: Add Person Tags

**As a** workflow developer  
**I want to** add tags to people for categorization  
**So that** I can segment and target community members effectively

## Epic Reference
This story is part of [Epic 6: People Management](./epic.md)

## Acceptance Criteria
- ✅ Support person ID and tag identification
- ✅ Add single or multiple tags simultaneously
- ✅ Handle tag creation if tags don't exist
- ✅ Prevent duplicate tag assignments

## Technical Implementation
```typescript
// Resource: People
// Operation: Add Tags
// Parameters:
{
  personId: string (required),
  tags: string[] (required), // array of tag names or IDs
  additionalFields: {
    createTagsIfNotExist?: boolean,
    tagSource?: string, // track who/what added the tags
    tagReason?: string, // reason for tagging
    expirationDate?: string, // temporary tags
    tagMetadata?: Record<string, any>, // additional tag context
    
    // Bulk Options
    skipDuplicates?: boolean,
    validateTagNames?: boolean
  }
}
```

## API Endpoint
- `POST /v1/person/tag/add`

## Test Cases
- Add single tag to person
- Add multiple tags simultaneously
- Create new tags when needed
- Skip duplicate tag assignments
- Handle invalid tag names
- Track tag assignment metadata

## Priority
Medium

## Story Points
3

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
