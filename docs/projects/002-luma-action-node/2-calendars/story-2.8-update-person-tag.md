# [PROJ_002] Story 2.8: Update Person Tag

## Story
**As a** workflow developer  
**I want to** update existing person tags for calendar organization  
**So that** I can modify tag properties, fix naming issues, and maintain organized member categorization.

## Acceptance Criteria

### Functional Requirements
- [ ] User can select "Calendar" resource and "Update Person Tag" operation
- [ ] User can specify tag API ID (required)
- [ ] User can update tag name, color, and description
- [ ] Node returns updated tag with complete metadata
- [ ] Handle tag name uniqueness validation when updating

### API Implementation
- **Endpoint:** `POST /public/v1/calendar/update-person-tag`
- **Method:** POST
- **Content-Type:** application/json
- **Required Parameters:** `api_id`
- **Optional Parameters:** `name`, `color`, `description`

### Data Structure
```typescript
interface UpdatePersonTagRequest {
  api_id: string; // Required - ID of tag to update
  name?: string; // Optional - new name
  color?: string; // Optional - new hex color code
  description?: string; // Optional - new description
}

interface UpdatePersonTagResponse {
  api_id: string;
  name: string;
  color?: string;
  description?: string;
  person_count: number; // Current number of people with this tag
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601 (updated timestamp)
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
      operation: ['updatePersonTag']
    }
  },
  description: 'API ID of the person tag to update'
},
{
  displayName: 'Update Fields',
  name: 'updateFields',
  type: 'collection',
  placeholder: 'Add Field',
  default: {},
  displayOptions: {
    show: {
      resource: ['calendar'],
      operation: ['updatePersonTag']
    }
  },
  options: [
    {
      displayName: 'Name',
      name: 'name',
      type: 'string',
      default: '',
      placeholder: 'New tag name',
      description: 'Updated name for the tag'
    },
    {
      displayName: 'Color',
      name: 'color',
      type: 'color',
      default: '#3b82f6',
      description: 'Updated color for the tag (hex color code)'
    },
    {
      displayName: 'Description',
      name: 'description',
      type: 'string',
      default: '',
      placeholder: 'Updated tag description',
      description: 'Updated description for the tag'
    }
  ]
}
```

### API Request Implementation
```typescript
const endpoint = '/public/v1/calendar/update-person-tag';
const body: UpdatePersonTagRequest = {
  api_id: this.getNodeParameter('apiId', i) as string
};

const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
if (updateFields.name) {
  body.name = updateFields.name as string;
}
if (updateFields.color) {
  body.color = updateFields.color as string;
}
if (updateFields.description !== undefined) {
  body.description = updateFields.description as string;
}

const response = await lumaApiRequest.call(this, 'POST', endpoint, body);
```

## Use Cases

### Common Scenarios
1. **Tag Maintenance**: Update tag names for better clarity
2. **Visual Organization**: Change tag colors for better visual grouping
3. **Description Updates**: Add or modify tag descriptions for better understanding
4. **Brand Alignment**: Update tag colors to match brand guidelines
5. **Cleanup Operations**: Standardize tag naming conventions

### Workflow Examples
- Bulk update tag colors to match new brand colors
- Standardize tag naming conventions across calendar
- Update tag descriptions for better user understanding
- Seasonal updates for campaign-specific tags

## Error Handling

### Common Error Scenarios
1. **Authentication Errors** (401)
   - Invalid API key or expired credentials
   - **Response**: Clear error message about authentication

2. **Authorization Errors** (403)
   - Insufficient permissions to update person tags
   - **Response**: Permission denied message

3. **Validation Errors** (400)
   - Invalid tag API ID format
   - Empty or invalid new tag name
   - Tag name already exists (if updating name)
   - Invalid color format
   - **Response**: Specific validation error details

4. **Not Found Errors** (404)
   - Tag with specified API ID not found
   - **Response**: Tag not found error

5. **Conflict Errors** (409)
   - New tag name already exists in calendar
   - **Response**: Duplicate tag name error

6. **Rate Limiting** (429)
   - Too many requests in time window
   - **Response**: Rate limit exceeded with retry guidance

## Input Validation

### Required Validations
- Tag API ID must be valid format and exist
- At least one field must be provided for update
- Tag name uniqueness (if updating name)
- Color format validation (if provided)

### Format Requirements
- API ID: Valid Luma API ID format
- Name: Non-empty string, reasonable length limit (if provided)
- Color: Valid hex color code format (#RRGGBB) (if provided)
- Description: Optional text with reasonable length limit

## Dependencies
- Valid Luma API credentials with calendar management permissions
- Calendar must exist and be accessible by the authenticated user
- Tag with specified API ID must exist
- User must have permission to update person tags

## Testing Scenarios
1. Update only tag name
2. Update only tag color
3. Update only tag description
4. Update all fields simultaneously
5. Update with empty description (clearing description)
6. Attempt to update non-existent tag
7. Attempt to update to duplicate tag name
8. Test with invalid color format
9. Test with invalid API ID format
10. Verify updated_at timestamp changes
11. Test permission errors for unauthorized users
12. Validate response structure and metadata

---

**Story Points:** 3  
**Priority:** Low  
**Epic:** [Epic 2: Calendar Operations](./epic.md)
