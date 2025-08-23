# [PROJ_002] Epic 6: People Management

## Overview
Implement comprehensive people and attendee management operations for the Luma Action Node, enabling users to manage community members, track attendance, and handle user relationships through n8n workflows.

## Epic Goals
- Enable complete people lifecycle management
- Support attendee tracking and engagement
- Handle community member relationships
- Provide people analytics and insights

## API Endpoints Covered

### People Operations
- `GET /v1/calendar/people/list` - List people in calendar
- `GET /v1/event/people/list` - List event attendees/interested
- `GET /v1/person/get` - Get person profile details
- `POST /v1/person/update` - Update person information
- `GET /v1/person/events` - Get person's event history
- `GET /v1/person/analytics` - Get person engagement analytics
- `POST /v1/person/tag/add` - Add tags to person
- `POST /v1/person/tag/remove` - Remove tags from person
- `GET /v1/person/tags/list` - List person's tags

## User Stories

This epic contains 9 user stories that implement comprehensive people management functionality:

### [Story 6.1: List Calendar People](./story-6.1-list-calendar-people.md)
Retrieve all people associated with a calendar for community membership management.
- **Priority:** High
- **Story Points:** 5
- **API:** `GET /v1/calendar/people/list`

### [Story 6.2: List Event People](./story-6.2-list-event-people.md)
Retrieve all people associated with a specific event for attendee tracking.
- **Priority:** High
- **Story Points:** 5
- **API:** `GET /v1/event/people/list`

### [Story 6.3: Get Person Details](./story-6.3-get-person-details.md)
Retrieve detailed information about a specific person including profile and history.
- **Priority:** High
- **Story Points:** 3
- **API:** `GET /v1/person/get`

### [Story 6.4: Update Person Information](./story-6.4-update-person-information.md)
Modify person profile information to keep community member data current.
- **Priority:** Medium
- **Story Points:** 5
- **API:** `POST /v1/person/update`

### [Story 6.5: Get Person Event History](./story-6.5-get-person-event-history.md)
Retrieve a person's complete event participation history for engagement analysis.
- **Priority:** Medium
- **Story Points:** 4
- **API:** `GET /v1/person/events`

### [Story 6.6: Get Person Analytics](./story-6.6-get-person-analytics.md)
Retrieve engagement analytics for a person to understand participation patterns.
- **Priority:** Low
- **Story Points:** 8
- **API:** `GET /v1/person/analytics`

### [Story 6.7: Add Person Tags](./story-6.7-add-person-tags.md)
Add tags to people for categorization and effective community segmentation.
- **Priority:** Medium
- **Story Points:** 3
- **API:** `POST /v1/person/tag/add`

### [Story 6.8: Remove Person Tags](./story-6.8-remove-person-tags.md)
Remove tags from people to maintain accurate categorization.
- **Priority:** Medium
- **Story Points:** 3
- **API:** `POST /v1/person/tag/remove`

### [Story 6.9: List Person Tags](./story-6.9-list-person-tags.md)
Retrieve all tags assigned to a person for categorization understanding.
- **Priority:** Low
- **Story Points:** 2
- **API:** `GET /v1/person/tags/list`

**Total Story Points:** 38

---

## Data Models

### Person Object Structure
```typescript
interface LumaPerson {
  person_id: string;
  email: string;
  
  // Basic Profile
  first_name?: string;
  last_name?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  
  // Contact Information
  phone?: string;
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
  last_activity_at?: string;
  verified_email: boolean;
  
  // Engagement Metrics
  engagement_score?: number;
  total_events_attended: number;
  total_events_registered: number;
  calendars_following: number;
  
  // Contact Preferences
  email_notifications: boolean;
  sms_notifications: boolean;
  event_reminders: boolean;
  marketing_emails: boolean;
  
  // Custom Fields
  custom_fields?: Record<string, any>;
  
  // Tags (when included)
  tags?: Array<{
    tag_id: string;
    tag_name: string;
    assigned_at: string;
    assigned_by?: string;
    tag_category?: string;
    expires_at?: string;
  }>;
  
  // Recent Activity (when included)
  recent_activity?: Array<{
    activity_type: 'registered' | 'attended' | 'checked_in' | 'cancelled';
    event_id: string;
    event_name: string;
    activity_date: string;
  }>;
}
```

### Person Event Participation
```typescript
interface PersonEventParticipation {
  participation_id: string;
  person_id: string;
  event_id: string;
  event_name: string;
  event_date: string;
  
  // Participation Details
  relationship_type: 'attending' | 'interested' | 'invited' | 'declined' | 'waitlisted';
  registration_date?: string;
  registration_source: 'direct' | 'social' | 'referral' | 'integration';
  
  // Attendance
  attendance_status?: 'checked_in' | 'no_show' | 'pending';
  check_in_time?: string;
  check_out_time?: string;
  
  // Ticket Information
  ticket_type_id?: string;
  ticket_type_name?: string;
  ticket_price?: number;
  payment_status?: 'paid' | 'pending' | 'refunded' | 'comped';
  
  // Engagement
  feedback_rating?: number; // 1-5 stars
  feedback_comment?: string;
  connections_made?: number; // networking connections
  
  // Cancellation
  cancelled_at?: string;
  cancellation_reason?: string;
}
```

### Person Analytics Response
```typescript
interface PersonAnalytics {
  person_id: string;
  analysis_period: {
    from: string;
    to: string;
  };
  
  // Engagement Metrics
  engagement_score: number; // 0-100
  engagement_level: 'low' | 'medium' | 'high';
  
  // Attendance Patterns
  attendance_stats: {
    total_registered: number;
    total_attended: number;
    attendance_rate: number;
    no_show_rate: number;
    cancellation_rate: number;
  };
  
  // Preferences Analysis
  preferences: {
    preferred_event_types?: string[];
    preferred_time_slots?: string[];
    preferred_days_of_week?: string[];
    avg_event_duration_preference?: number;
    price_sensitivity?: 'low' | 'medium' | 'high';
  };
  
  // Behavioral Insights
  behavior_insights: {
    registration_pattern: 'early_bird' | 'last_minute' | 'consistent';
    loyalty_level: 'new' | 'returning' | 'loyal' | 'champion';
    social_activity: 'low' | 'medium' | 'high';
    feedback_participation: number; // percentage of events where feedback given
  };
  
  // Growth Trends
  growth_trends?: {
    engagement_trend: 'increasing' | 'stable' | 'decreasing';
    activity_trend: 'increasing' | 'stable' | 'decreasing';
    monthly_activity?: Array<{
      month: string;
      events_registered: number;
      events_attended: number;
      engagement_score: number;
    }>;
  };
  
  // Comparisons (when requested)
  peer_comparison?: {
    percentile_engagement: number; // 0-100
    percentile_attendance: number;
    similar_people_count: number;
  };
}
```

## Error Handling

### Common Error Scenarios
1. **Identity Errors**
   - Invalid person IDs
   - Email conflicts during updates
   - Duplicate person detection

2. **Privacy Errors**
   - Insufficient permissions to view/update
   - Privacy settings restrictions
   - GDPR/data protection violations

3. **Tag Errors**
   - Invalid tag names or formats
   - Tag limit exceeded
   - Tag category conflicts

4. **Data Integrity Errors**
   - Inconsistent event history
   - Analytics calculation failures
   - Profile data validation errors

## Integration Points

### Dependencies
- User authentication and permissions
- Event and calendar systems
- Tag management system
- Analytics calculation engine

### Downstream Effects
- Profile updates affect event notifications
- Tag changes impact segmentation
- Analytics updates influence recommendations
- Privacy changes affect data access

## Performance Considerations

### Optimization Strategies
- Cache frequently accessed profiles
- Efficient analytics calculations
- Batch tag operations
- Optimized event history queries

### Scale Considerations
- Large numbers of people per calendar
- Extensive event participation histories
- Real-time engagement calculations
- Complex analytics across many people

## Testing Strategy

### Unit Tests
- Profile validation logic
- Tag assignment/removal logic
- Analytics calculation accuracy
- Privacy control validation

### Integration Tests
- People CRUD operations
- Event participation tracking
- Tag management workflows
- Analytics generation performance

### Business Logic Tests
- Engagement score calculations
- Preference identification accuracy
- Privacy control effectiveness
- Data consistency maintenance

## Documentation Requirements

### Configuration Guides
- People management workflows
- Tag strategy examples
- Analytics interpretation guides
- Privacy compliance patterns

### API Reference
- Parameter validation rules
- Response format specifications
- Error code definitions
- Rate limiting information

## Definition of Done

### Functional Criteria
- ✅ All 9 user stories implemented and tested
- ✅ Complete people lifecycle management
- ✅ Comprehensive analytics and insights
- ✅ Robust tag management system

### Quality Criteria
- ✅ Code follows n8n patterns
- ✅ TypeScript interfaces comprehensive
- ✅ Test coverage including edge cases
- ✅ Performance benchmarks met

### Business Criteria
- ✅ Privacy controls effective
- ✅ Analytics insights accurate
- ✅ Tag management efficient
- ✅ Integration scenarios validated
