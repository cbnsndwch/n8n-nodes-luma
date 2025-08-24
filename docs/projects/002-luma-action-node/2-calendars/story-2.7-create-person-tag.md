# [PROJ_002] Story 2.7: Create Person Tag

## Story
**As a** workflow developer  
**I want to** create new person tags for calendar organization  
**So that** I can categorize and organize calendar members programmatically.

## Acceptance Criteria

### Functional Requirements
- [ ] User can select "Calendar" resource and "Create Person Tag" operation
- [ ] User can specify tag name (required)
- [ ] User can set optional tag properties (color, description)
- [ ] Node returns created tag with complete metadata
- [ ] Handle tag name uniqueness validation

### API Implementation
- **Endpoint:** `POST /public/v1/calendar/create-person-tag`
- **Method:** POST
- **Content-Type:** application/json
- **Required Parameters:** `name`
- **Optional Parameters:** `color`, `description`

### Data Structure
```typescript
interface CreatePersonTagRequest {
  name: string; // Required
  color?: string; // Optional hex color code
  description?: string; // Optional description
}

interface CreatePersonTagResponse {
  api_id: string;
  name: string;
  color?: string;
  description?: string;
  person_count: number; // Initially 0
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}
```

## Technical Implementation

### Node Configuration
```typescript
{
  displayName: 'Tag Name',
  name: 'name',
  type: 'string',
  required: true,
  default: '',
  placeholder: 'Enter tag name',
  displayOptions: {
    show: {
      resource: ['calendar'],
      operation: ['createPersonTag']
    }
  },
  description: 'Name of the person tag to create'
},
{
  displayName: 'Additional Fields',
  name: 'additionalFields',
  type: 'collection',
  placeholder: 'Add Field',
  default: {},
  displayOptions: {
    show: {
      resource: ['calendar'],
      operation: ['createPersonTag']
    }
  },
  options: [
    {
      displayName: 'Color',
      name: 'color',
      type: 'color',
      default: '#3b82f6',
      description: 'Color for the tag (hex color code)'
    },
    {
      displayName: 'Description',
      name: 'description',
      type: 'string',
      default: '',
      placeholder: 'Tag description',
      description: 'Optional description for the tag'
    }
  ]
}
```

### API Request Implementation
```typescript
const endpoint = '/public/v1/calendar/create-person-tag';
const body: CreatePersonTagRequest = {
  name: this.getNodeParameter('name', i) as string
};

const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
if (additionalFields.color) {
  body.color = additionalFields.color as string;
}
if (additionalFields.description) {
  body.description = additionalFields.description as string;
}

const response = await lumaApiRequest.call(this, 'POST', endpoint, body);
```

## Use Cases

### Common Scenarios
1. **Member Categorization**: Create tags for different member types or interests
2. **Event Management**: Create tags for event-specific categorization
3. **Automation Setup**: Create tags as part of automated member management workflows
4. **Organizational Structure**: Create tags to reflect organizational hierarchy
5. **Campaign Management**: Create tags for marketing or communication campaigns

### Workflow Examples
- Create member type tags (VIP, Regular, Student, Corporate)
- Set up interest-based tags for targeted communications
- Create location-based tags for regional events
- Implement role-based tags for permission management

## Error Handling

### Common Error Scenarios
1. **Authentication Errors** (401)
   - Invalid API key or expired credentials
   - **Response**: Clear error message about authentication

2. **Authorization Errors** (403)
   - Insufficient permissions to create person tags
   - **Response**: Permission denied message

3. **Validation Errors** (400)
   - Empty or invalid tag name
   - Tag name already exists
   - Invalid color format
   - **Response**: Specific validation error details

4. **Conflict Errors** (409)
   - Tag name already exists in calendar
   - **Response**: Duplicate tag name error

5. **Rate Limiting** (429)
   - Too many requests in time window
   - **Response**: Rate limit exceeded with retry guidance

## Input Validation

### Required Validations
- Tag name must not be empty
- Tag name should be unique within the calendar
- Color format validation (if provided)
- Description length limits (if applicable)

### Format Requirements
- Name: Non-empty string, reasonable length limit
- Color: Valid hex color code format (#RRGGBB)
- Description: Optional text with reasonable length limit

## Dependencies
- Valid Luma API credentials with calendar management permissions
- Calendar must exist and be accessible by the authenticated user
- User must have permission to create person tags

## Testing Scenarios
1. Create tag with name only (minimal requirements)
2. Create tag with all optional fields
3. Attempt to create duplicate tag name
4. Test with invalid color format
5. Test with empty/invalid tag name
6. Verify created tag appears in list-person-tags
7. Test permission errors for unauthorized users
8. Validate response structure and metadata

---

**Story Points:** 3  
**Priority:** Low  
**Epic:** [Epic 2: Calendar Operations](./epic.md)
