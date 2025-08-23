# [PROJ_002] Story 5.1: Get Authenticated User

## User Story
**As a** workflow developer  
**I want to** retrieve information about the authenticated user  
**So that** I can verify credentials and access user context

## Acceptance Criteria
- ✅ Return authenticated user profile
- ✅ Include user permissions and capabilities
- ✅ Provide account status information
- ✅ Handle authentication errors gracefully

## Technical Implementation
```typescript
// Resource: User
// Operation: Get Self
// Parameters: No additional parameters required
```

## API Endpoint
- `GET /public/v1/user/get-self` - Get authenticated user information

## Response Structure
```typescript
interface UserSelfResponse {
  user: {
    api_id: string;
    name: string;
    email: string;
    username?: string;
    avatar_url?: string;
    timezone?: string;
    created_at: string;
    updated_at: string;
    
    // Account details
    plan_type: string;
    is_verified: boolean;
    is_active: boolean;
    
    // Permissions
    permissions: {
      can_create_events: boolean;
      can_create_calendars: boolean;
      can_manage_coupons: boolean;
    };
  };
}
```

## Test Cases
- Retrieve user information with valid API key
- Handle invalid authentication
- Verify returned user data structure
- Test permission flags
- Check timezone handling

## Priority
High

## Story Points
2

## Epic
[Epic 5: Utility Operations](./epic.md)

## GitHub Issue
[Story 5.1: Get Authenticated User](https://github.com/cbnsndwch/n8n-nodes-luma/issues/43)
