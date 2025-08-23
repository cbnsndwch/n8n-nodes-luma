# [PROJ_002] Story 5.2: Entity Lookup by Slug

## User Story
**As a** workflow developer  
**I want to** lookup entities by their slug identifier  
**So that** I can resolve human-readable names to API IDs

## Acceptance Criteria
- ✅ Support slug input (required)
- ✅ Return entity type and API ID
- ✅ Handle multiple entity types
- ✅ Provide clear error for invalid slugs

## Technical Implementation
```typescript
// Resource: Utility
// Operation: Entity Lookup
// Parameters:
{
  slug: string (required),
  additionalFields: {
    entityType?: 'event' | 'calendar' | 'user',
    includeDetails?: boolean
  }
}
```

## API Endpoint
- `GET /public/v1/entity/lookup` - Lookup entity by slug

## Response Structure
```typescript
interface EntityLookupResponse {
  entity: {
    api_id: string;
    slug: string;
    type: 'event' | 'calendar' | 'user';
    name: string;
    status: 'active' | 'inactive' | 'deleted';
    
    // Optional details (if includeDetails=true)
    details?: {
      description?: string;
      created_at?: string;
      updated_at?: string;
      owner_api_id?: string;
      permissions?: string[];
    };
  };
}
```

## Test Cases
- Lookup valid event slug
- Lookup valid calendar slug
- Lookup valid user slug
- Handle invalid/non-existent slug
- Test with/without additional details

## Priority
Medium

## Story Points
3

## Epic
[Epic 5: Utility Operations](./epic.md)

## GitHub Issue
[Story 5.2: Entity Lookup by Slug](https://github.com/cbnsndwch/n8n-nodes-luma/issues/44)
