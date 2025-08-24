# [PROJ_002] Story 3.2: Get Guest Details

## User Story
**As a** workflow developer  
**I want to** retrieve detailed information about a specific guest  
**So that** I can access individual registration data and history

## Acceptance Criteria
- ✅ Support guest ID input (required)
- ✅ Return complete guest profile and registration details
- ✅ Include event-specific information
- ✅ Include registration history and timestamps

## Technical Implementation
```typescript
// Resource: Guest
// Operation: Get
// Parameters:
{
  guestId: string (required),
  additionalFields: {
    includeHistory?: boolean,
    includePersonalInfo?: boolean,
    includeEventDetails?: boolean
  }
}
```

## API Endpoint
- `GET /v1/guest/get` - Get single guest details

## Test Cases
- Valid guest ID returns guest data
- Invalid guest ID returns appropriate error
- History included when requested
- Privacy settings respected

## Priority
Medium

## Story Points
3
