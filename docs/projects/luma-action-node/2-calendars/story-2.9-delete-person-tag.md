# [PROJ_002] Story 2.9: Delete Person Tag

## Story
**As a** workflow developer  
**I want to** delete person tags from calendar  
**So that** I can clean up unused tags, remove obsolete categorizations, and maintain organized member management.

## Acceptance Criteria

### Functional Requirements
- [ ] User can select "Calendar" resource and "Delete Person Tag" operation
- [ ] User can specify tag API ID (required)
- [ ] Node confirms successful deletion
- [ ] Handle cases where tag is in use by people
- [ ] Provide clear feedback on deletion status

### API Implementation
- **Endpoint:** `POST /public/v1/calendar/delete-person-tag`
- **Method:** POST
- **Content-Type:** application/json
- **Required Parameters:** `api_id`

### Data Structure
```typescript
interface DeletePersonTagRequest {
  api_id: string; // Required - ID of tag to delete
}

interface DeletePersonTagResponse {
  success: boolean;
  message?: string;
  deleted_tag?: {
    api_id: string;
    name: string;
    person_count: number; // Number of people who had this tag
  };
}
```

## Technical Implementation

### Node Configuration
```typescript
{
  displayName: 'Tag ID',
  name: 'apiId',
  type: 'string',
  required: true,
  default: '',
  placeholder: 'tag_123abc...',
  displayOptions: {
    show: {
      resource: ['calendar'],
      operation: ['deletePersonTag']
    }
  },
  description: 'API ID of the person tag to delete'
},
{
  displayName: 'Options',
  name: 'options',
  type: 'collection',
  placeholder: 'Add Option',
  default: {},
  displayOptions: {
    show: {
      resource: ['calendar'],
      operation: ['deletePersonTag']
    }
  },
  options: [
    {
      displayName: 'Force Delete',
      name: 'forceDelete',
      type: 'boolean',
      default: false,
      description: 'Force deletion even if tag is assigned to people'
    }
  ]
}
```

### API Request Implementation
```typescript
const endpoint = '/public/v1/calendar/delete-person-tag';
const body: DeletePersonTagRequest = {
  api_id: this.getNodeParameter('apiId', i) as string
};

const options = this.getNodeParameter('options', i) as IDataObject;
if (options.forceDelete) {
  body.force_delete = true;
}

const response = await lumaApiRequest.call(this, 'POST', endpoint, body);
```

## Use Cases

### Common Scenarios
1. **Tag Cleanup**: Remove unused or obsolete tags
2. **System Maintenance**: Clean up duplicate or incorrect tags
3. **Organizational Changes**: Remove tags that no longer apply
4. **Campaign Cleanup**: Remove temporary campaign-specific tags
5. **Data Migration**: Clean up tags during system migrations

### Workflow Examples
- Automated cleanup of tags with zero person count
- Remove seasonal tags after campaigns end
- Clean up duplicate tags created by mistake
- Remove test tags from production environment

## Error Handling

### Common Error Scenarios
1. **Authentication Errors** (401)
   - Invalid API key or expired credentials
   - **Response**: Clear error message about authentication

2. **Authorization Errors** (403)
   - Insufficient permissions to delete person tags
   - **Response**: Permission denied message

3. **Validation Errors** (400)
   - Invalid tag API ID format
   - Missing required API ID parameter
   - **Response**: Specific validation error details

4. **Not Found Errors** (404)
   - Tag with specified API ID not found
   - **Response**: Tag not found error

5. **Conflict Errors** (409)
   - Tag is currently assigned to people (without force delete)
   - **Response**: Tag in use error with person count

6. **Rate Limiting** (429)
   - Too many requests in time window
   - **Response**: Rate limit exceeded with retry guidance

## Safety Considerations

### Deletion Safeguards
- Warn when deleting tags assigned to people
- Provide option to force delete if needed
- Return information about affected people count
- Consider soft delete vs hard delete based on API behavior

### Data Impact
- Removing tags will unassign them from all people
- This operation may be irreversible
- Consider backup or export before deletion
- Impact on reporting and analytics

## Input Validation

### Required Validations
- Tag API ID must be valid format and exist
- Confirmation of deletion intent
- Check for tag usage before deletion (unless force delete)

### Format Requirements
- API ID: Valid Luma API ID format
- Force delete: Boolean flag for overriding safety checks

## Dependencies
- Valid Luma API credentials with calendar management permissions
- Calendar must exist and be accessible by the authenticated user
- Tag with specified API ID must exist
- User must have permission to delete person tags

## Testing Scenarios
1. Delete unused tag (person_count = 0)
2. Attempt to delete tag in use without force flag
3. Delete tag in use with force flag
4. Attempt to delete non-existent tag
5. Test with invalid API ID format
6. Test permission errors for unauthorized users
7. Verify tag removal from list-person-tags
8. Test with tags assigned to many people
9. Validate response structure and success indicators
10. Test rate limiting behavior

## Rollback Considerations

### Recovery Options
- Tags cannot be recovered after deletion
- Consider exporting tag data before deletion
- Document deleted tags for potential recreation
- Impact on existing workflows using deleted tags

---

**Story Points:** 3  
**Priority:** Low  
**Epic:** [Epic 2: Calendar Operations](./epic.md)
