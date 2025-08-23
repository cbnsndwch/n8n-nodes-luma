# [PROJ_002] Epic 7: User Management

## Overview
Implement comprehensive user account and profile management operations for the Luma Action Node, enabling users to manage their own accounts, preferences, and platform interactions through n8n workflows.

## Epic Goals
- Enable complete user account lifecycle management
- Support user preference and settings configuration
- Handle user authentication and authorization
- Provide user activity tracking and insights

## API Endpoints Covered

### User Operations
- `GET /v1/user/me` - Get current user profile
- `POST /v1/user/update` - Update user profile information
- `GET /v1/user/settings` - Get user preferences and settings
- `POST /v1/user/settings/update` - Update user settings
- `GET /v1/user/activity` - Get user activity history
- `GET /v1/user/calendars` - Get user's calendars (owned/following)
- `POST /v1/user/calendar/follow` - Follow a calendar
- `POST /v1/user/calendar/unfollow` - Unfollow a calendar
- `GET /v1/user/notifications` - Get user notifications
- `POST /v1/user/notifications/mark-read` - Mark notifications as read

## User Stories

The user stories for this epic have been moved to individual files for better tracking and management:

### Profile Management
- [Story 7.1: Get Current User Profile](./story-7.1-get-current-user-profile.md)
- [Story 7.2: Update User Profile](./story-7.2-update-user-profile.md)

### Settings Management
- [Story 7.3: Get User Settings](./story-7.3-get-user-settings.md)
- [Story 7.4: Update User Settings](./story-7.4-update-user-settings.md)

### Activity & Analytics
- [Story 7.5: Get User Activity History](./story-7.5-get-user-activity-history.md)

### Calendar Relationships
- [Story 7.6: Get User Calendars](./story-7.6-get-user-calendars.md)
- [Story 7.7: Follow Calendar](./story-7.7-follow-calendar.md)
- [Story 7.8: Unfollow Calendar](./story-7.8-unfollow-calendar.md)

### Notification Management
- [Story 7.9: Get User Notifications](./story-7.9-get-user-notifications.md)
- [Story 7.10: Mark Notifications as Read](./story-7.10-mark-notifications-as-read.md)

### Story Implementation Status
All stories are currently in planning phase and ready for development. Each story file contains:
- Detailed acceptance criteria
- Technical implementation specifications
- Test case scenarios
- API endpoint mappings
- Dependency requirements
- Definition of done criteria

---

## Data Models

### User Profile Object Structure
```typescript
interface LumaUser {
  user_id: string;
  email: string;
  email_verified: boolean;
  
  // Basic Profile
  first_name?: string;
  last_name?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  
  // Contact Information
  phone?: string;
  phone_verified?: boolean;
  website?: string;
  
  // Professional Info
  title?: string;
  company?: string;
  industry?: string;
  
  // Location
  city?: string;
  country?: string;
  timezone?: string;
  
  // Social Profiles
  linkedin_url?: string;
  twitter_handle?: string;
  instagram_handle?: string;
  
  // Platform Info
  luma_profile_url: string;
  joined_at: string;
  last_login_at?: string;
  last_activity_at?: string;
  
  // Account Status
  account_status: 'active' | 'suspended' | 'pending_verification' | 'deactivated';
  subscription_status?: 'free' | 'pro' | 'business' | 'enterprise';
  subscription_expires_at?: string;
  
  // Statistics
  calendars_owned: number;
  calendars_following: number;
  events_created: number;
  events_attended: number;
  
  // Settings Summary (when included)
  settings?: {
    notifications_enabled: boolean;
    privacy_level: 'public' | 'private' | 'selective';
    preferred_language: string;
    preferred_timezone: string;
  };
  
  // API Usage (for API users)
  api_usage?: {
    plan: string;
    requests_this_month: number;
    request_limit: number;
    rate_limit_per_hour: number;
  };
}
```

### User Activity Record
```typescript
interface UserActivity {
  activity_id: string;
  user_id: string;
  activity_type: string;
  activity_date: string;
  
  // Activity Context
  description: string;
  category: 'event' | 'calendar' | 'profile' | 'system' | 'security';
  
  // Related Objects
  related_event_id?: string;
  related_calendar_id?: string;
  related_user_id?: string;
  
  // Technical Context
  ip_address?: string;
  user_agent?: string;
  location?: {
    city?: string;
    country?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Activity Details
  details?: {
    before_value?: any;
    after_value?: any;
    additional_data?: Record<string, any>;
  };
  
  // Privacy
  visible_to_user: boolean;
  sensitive_data: boolean;
}
```

### User Notification
```typescript
interface UserNotification {
  notification_id: string;
  user_id: string;
  
  // Notification Content
  type: string;
  title: string;
  message: string;
  icon?: string;
  
  // Status
  status: 'unread' | 'read';
  priority: 'high' | 'medium' | 'low';
  
  // Context
  related_event_id?: string;
  related_calendar_id?: string;
  related_user_id?: string;
  
  // Actions
  action_buttons?: Array<{
    label: string;
    action: string;
    url?: string;
    api_endpoint?: string;
  }>;
  
  // Timing
  created_at: string;
  read_at?: string;
  expires_at?: string;
  
  // Delivery
  delivery_methods: Array<'in_app' | 'email' | 'sms' | 'push'>;
  delivered_via?: Array<{
    method: string;
    delivered_at: string;
    status: 'sent' | 'delivered' | 'failed';
  }>;
}
```

### User Calendar Relationship
```typescript
interface UserCalendarRelationship {
  relationship_id: string;
  user_id: string;
  calendar_id: string;
  calendar_name: string;
  
  // Relationship Type
  relationship_type: 'owner' | 'admin' | 'editor' | 'follower';
  
  // Permissions
  permissions: {
    can_edit_events: boolean;
    can_edit_calendar: boolean;
    can_invite_people: boolean;
    can_moderate_comments: boolean;
    can_view_analytics: boolean;
  };
  
  // Follow Settings (for followers)
  follow_settings?: {
    notifications_enabled: boolean;
    notification_types: string[];
    auto_accept_invites: boolean;
    show_following_status: boolean;
  };
  
  // Timestamps
  created_at: string;
  last_activity_at?: string;
  
  // Statistics
  events_attended?: number;
  engagement_score?: number;
}
```

## Error Handling

### Common Error Scenarios
1. **Authentication Errors**
   - Invalid or expired tokens
   - Insufficient permissions
   - Account status restrictions

2. **Validation Errors**
   - Invalid email formats
   - Setting constraint violations
   - Profile data validation failures

3. **Privacy Errors**
   - Privacy setting conflicts
   - Data access restrictions
   - Consent requirement violations

4. **Business Logic Errors**
   - Calendar follow/unfollow constraints
   - Notification delivery failures
   - Setting dependency conflicts

## Integration Points

### Dependencies
- Authentication system
- Email verification service
- Notification delivery system
- Calendar and event systems

### Downstream Effects
- Profile changes affect event notifications
- Setting changes impact user experience
- Calendar relationships affect permissions
- Activity tracking influences recommendations

## Performance Considerations

### Optimization Strategies
- Cache user profiles and settings
- Efficient activity history queries
- Batch notification operations
- Optimized calendar relationship queries

### Scale Considerations
- Users with extensive activity histories
- Large numbers of notifications
- Complex calendar relationships
- Real-time setting synchronization

## Testing Strategy

### Unit Tests
- Profile validation logic
- Settings update logic
- Notification processing
- Activity tracking accuracy

### Integration Tests
- User CRUD operations
- Calendar follow/unfollow workflows
- Notification delivery systems
- Setting synchronization

### Business Logic Tests
- Privacy control enforcement
- Permission validation
- Setting dependency resolution
- Activity correlation accuracy

## Documentation Requirements

### Configuration Guides
- User onboarding workflows
- Privacy setting explanations
- Notification configuration guides
- Calendar management patterns

### API Reference
- Parameter validation rules
- Response format specifications
- Error code definitions
- Rate limiting information

## Definition of Done

### Functional Criteria
- ✅ All 10 user stories implemented and tested
- ✅ Complete user account lifecycle management
- ✅ Comprehensive settings and preferences
- ✅ Robust notification system

### Quality Criteria
- ✅ Code follows n8n patterns
- ✅ TypeScript interfaces comprehensive
- ✅ Test coverage including edge cases
- ✅ Performance benchmarks met

### Business Criteria
- ✅ Privacy controls effective
- ✅ User experience optimized
- ✅ Security measures implemented
- ✅ Integration scenarios validated
