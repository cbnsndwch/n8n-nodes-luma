# [PROJ_002] Story 5.3: Create Image Upload URL

## User Story
**As a** event organizer  
**I want to** generate secure upload URLs for images  
**So that** I can attach images to events and calendars

## Acceptance Criteria
- ✅ Generate secure upload URL with time limits
- ✅ Support different image types and sizes
- ✅ Return upload instructions and constraints
- ✅ Handle image validation requirements

## Technical Implementation
```typescript
// Resource: Utility
// Operation: Create Image Upload URL
// Parameters:
{
  additionalFields: {
    imageType?: 'event_cover' | 'calendar_avatar' | 'user_avatar',
    maxSizeBytes?: number,
    allowedFormats?: string[], // ['jpg', 'png', 'gif']
    expirationMinutes?: number
  }
}
```

## API Endpoint
- `POST /public/v1/images/create-upload-url` - Create image upload URL

## Request Body Structure
```typescript
interface CreateUploadUrlRequest {
  image_type?: 'event_cover' | 'calendar_avatar' | 'user_avatar';
  max_size_bytes?: number;
  allowed_formats?: string[];
  expiration_minutes?: number;
}
```

## Response Structure
```typescript
interface CreateUploadUrlResponse {
  upload_url: string;
  upload_fields: {
    [key: string]: string; // Additional form fields for upload
  };
  constraints: {
    max_size_bytes: number;
    allowed_formats: string[];
    expires_at: string; // ISO 8601
  };
  image_id: string; // To reference after upload
  instructions: {
    method: 'POST';
    content_type: 'multipart/form-data';
    required_fields: string[];
  };
}
```

## Test Cases
- Generate upload URL for event cover image
- Test different image types
- Validate size constraints
- Check expiration handling
- Test upload field requirements

## Priority
Medium

## Story Points
5

## Epic
[Epic 5: Utility Operations](./epic.md)

## GitHub Issue
[Story 5.3: Create Image Upload URL](https://github.com/cbnsndwch/n8n-nodes-luma/issues/45)
