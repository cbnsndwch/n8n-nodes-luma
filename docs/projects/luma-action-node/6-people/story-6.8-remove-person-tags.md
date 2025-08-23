# Story 6.8: Remove Person Tags

**As a** workflow developer  
**I want to** remove tags from people  
**So that** I can maintain accurate categorization

## Epic Reference
This story is part of [Epic 6: People Management](./epic.md)

## Acceptance Criteria
- ✅ Support person ID and tag identification
- ✅ Remove single or multiple tags
- ✅ Handle non-existent tag removal gracefully
- ✅ Maintain tag removal audit trail

## Technical Implementation
```typescript
// Resource: People
// Operation: Remove Tags
// Parameters:
{
  personId: string (required),
  tags: string[] (required), // array of tag names or IDs to remove
  additionalFields: {
    removeSource?: string, // track who/what removed the tags
    removeReason?: string, // reason for removal
    removeAllTags?: boolean, // remove all tags instead of specific ones
    
    // Validation Options
    requireTagExists?: boolean, // error if tag doesn't exist
    skipNonExistentTags?: boolean // silently skip missing tags
  }
}
```

## API Endpoint
- `POST /v1/person/tag/remove`

## Test Cases
- Remove single tag from person
- Remove multiple tags simultaneously
- Handle removal of non-existent tags
- Remove all tags from person
- Track tag removal audit trail
- Validate tag existence before removal

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
