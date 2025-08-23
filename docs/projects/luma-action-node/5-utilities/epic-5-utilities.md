# [PROJ_002] Epic 5: Utility Operations

## Overview
Implement utility and support operations for the Luma Action Node, enabling users to access user information, perform entity lookups, and handle image uploads through n8n workflows.

## Epic Goals
- Enable user account information access
- Support entity resolution by slug
- Handle image upload workflows
- Provide auxiliary operations for complete Luma integration

## API Endpoints Covered

Based on Luma's actual API structure for utility operations:

### User Operations
- `GET /public/v1/user/get-self` - Get authenticated user information

### Entity Operations
- `GET /public/v1/entity/lookup` - Look up entities by slug

### Image Operations
- `POST /public/v1/images/create-upload-url` - Create upload URL for images

## User Stories

This epic contains 3 user stories that implement utility functionality:

### [Story 5.1: Get User Information](./story-5.1-get-user-information.md)
Retrieve information about the authenticated user account.
- **Priority:** Medium
- **Story Points:** 3
- **API:** `GET /public/v1/user/get-self`

### [Story 5.2: Lookup Entity by Slug](./story-5.2-lookup-entity-by-slug.md)
Resolve entity information using slug identifiers.
- **Priority:** Low
- **Story Points:** 3
- **API:** `GET /public/v1/entity/lookup`

### [Story 5.3: Create Image Upload URL](./story-5.3-create-image-upload-url.md)
Generate secure upload URLs for image assets.
- **Priority:** Medium
- **Story Points:** 5
- **API:** `POST /public/v1/images/create-upload-url`

**Total Story Points:** 11

---

## Data Models

### User Information Structure
```typescript
interface LumaUser {
  api_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  company?: string;
  job_title?: string;
  linkedin_url?: string;
  twitter_url?: string;
  website_url?: string;
  timezone?: string;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}
```

### Entity Lookup Structure
```typescript
interface EntityLookupResponse {
  found: boolean;
  entity?: {
    api_id: string;
    slug: string;
    type: 'event' | 'calendar' | 'user';
    name: string;
    url: string;
    metadata?: Record<string, any>;
  };
}
```

### Image Upload URL Structure
```typescript
interface ImageUploadResponse {
  upload_url: string;
  public_url: string;
  expires_at: string; // ISO 8601
  max_file_size: number; // bytes
  allowed_formats: string[]; // ['jpg', 'png', 'gif', etc.]
}
```

## Error Handling

### Common Error Scenarios
1. **Authentication Errors** (401)
   - Invalid API key
   - Expired credentials

2. **Authorization Errors** (403)
   - Insufficient permissions for user data access
   - Image upload restrictions

3. **Validation Errors** (400)
   - Invalid slug format
   - Invalid image upload parameters
   - Missing required fields

4. **Resource Errors** (404)
   - Entity not found for slug
   - User information not accessible

5. **File Upload Errors** (413/422)
   - File too large
   - Unsupported image format

## Integration Points

### Dependencies
- Valid Luma API key with appropriate permissions
- For image uploads: proper file handling in n8n workflows
- For entity lookups: knowledge of valid slug patterns

### Downstream Effects
- User information can be used for personalization
- Entity lookups enable dynamic resource resolution
- Image uploads support event and user profile management

## Performance Considerations

### Optimization Strategies
- Cache user information for session duration
- Implement efficient slug validation
- Handle image upload timeouts gracefully
- Minimize API calls for repeated operations

### Scale Considerations
- User information calls are typically low-frequency
- Entity lookups may be used in bulk operations
- Image uploads require bandwidth considerations

---

## Technical Implementation Notes

### User Operations
- User information is tied to API key authentication
- May include subscription and permission details
- Useful for workflow personalization and validation

### Entity Resolution
- Slug-based lookups support friendly URL patterns
- Enable dynamic resource discovery in workflows
- Support multiple entity types (events, calendars, users)

### Image Management
- Upload URLs have expiration times
- Support multiple image formats
- Integration with event and profile image workflows

**Dependencies:** This epic has minimal dependencies but supports all other epics by providing auxiliary functionality.

---

## Validation Scenarios
After implementing this epic, validate:
- [ ] User information retrieval works with valid API keys
- [ ] Entity lookup correctly resolves various slug formats
- [ ] Image upload URLs are generated and functional
- [ ] Error handling works for invalid slugs and permissions
- [ ] Integration points work with other epic operations
