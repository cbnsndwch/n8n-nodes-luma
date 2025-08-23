# [PROJ_002] Story 2.6: List Person Tags

## Story
**As a** workflow developer  
**I want to** retrieve person tags for calendar organization  
**So that** I can implement tag-based filtering, analytics, and member categorization workflows.

## Acceptance Criteria

### Functional Requirements
- [ ] User can select "Calendar" resource and "List Person Tags" operation
- [ ] User can configure pagination options
- [ ] Node returns paginated list of person tags with complete metadata
- [ ] Each tag includes usage statistics and metadata

### API Implementation
- **Endpoint:** `GET /public/v1/calendar/list-person-tags`
- **Required Parameters:** None (all parameters are optional)
- **Optional Parameters:** 
  - `pagination_cursor` - For pagination
  - `pagination_limit` - Number of items to return

### Data Structure
```typescript
interface PersonTagsListResponse {
  has_more: boolean;
  next_cursor?: string;
  entries: PersonTag[];
}

interface PersonTag {
  api_id: string;
  name: string;
  color?: string;
  description?: string;
  person_count?: number; // Number of people with this tag
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}
```

## Technical Implementation

### Node Configuration
```typescript
{
  displayName: 'Pagination Limit',
  name: 'paginationLimit',
  type: 'number',
  default: 50,
  typeOptions: {
    minValue: 1,
    maxValue: 100
  },
  displayOptions: {
    show: {
      resource: ['calendar'],
      operation: ['listPersonTags']
    }
  },
  description: 'Number of tags to return (1-100)'
},
{
  displayName: 'Pagination Cursor',
  name: 'paginationCursor',
  type: 'string',
  default: '',
  placeholder: 'Value from previous response next_cursor',
  displayOptions: {
    show: {
      resource: ['calendar'],
      operation: ['listPersonTags']
    }
  },
  description: 'Cursor for pagination from previous request'
}
```

### API Request Implementation
```typescript
const endpoint = '/public/v1/calendar/list-person-tags';
const queryParams = new URLSearchParams();

if (paginationCursor) queryParams.append('pagination_cursor', paginationCursor);
if (paginationLimit) queryParams.append('pagination_limit', paginationLimit.toString());

const response = await lumaApiRequest.call(this, 'GET', `${endpoint}?${queryParams}`);
```

## Use Cases

### Common Scenarios
1. **Tag Management**: List all available tags for selection interfaces
2. **Analytics**: Analyze tag usage across calendar members
3. **Organization**: Review tag structure for cleanup or optimization
4. **Reporting**: Generate reports showing member categorization
5. **Automation**: Set up workflows based on tag availability

### Workflow Examples
- Export tag lists for external systems integration
- Create tag usage reports for calendar administrators
- Set up conditional workflows based on available tags
- Implement tag-based member segmentation

## Error Handling

### Common Error Scenarios
1. **Authentication Errors** (401)
   - Invalid API key or expired credentials
   - **Response**: Clear error message about authentication

2. **Authorization Errors** (403)
   - Insufficient permissions to access calendar person tags
   - **Response**: Permission denied message

3. **Validation Errors** (400)
   - Invalid pagination parameters
   - **Response**: Specific validation error details

4. **Rate Limiting** (429)
   - Too many requests in time window
   - **Response**: Rate limit exceeded with retry guidance

## Dependencies
- Valid Luma API credentials with calendar access permissions
- Calendar must exist and be accessible by the authenticated user

## Testing Scenarios
1. List all person tags without pagination
2. Test pagination with cursor-based navigation
3. Handle empty tag lists gracefully
4. Validate pagination parameters
5. Test with different pagination limits
6. Verify tag metadata completeness
7. Handle API errors appropriately

---

**Story Points:** 3  
**Priority:** Low  
**Epic:** [Epic 2: Calendar Operations](./epic.md)
