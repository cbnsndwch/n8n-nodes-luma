# [PROJ_002] Story 2.5: List Calendar People

## Story
**As a** workflow developer  
**I want to** retrieve a list of people associated with a calendar  
**So that** I can analyze membership, manage notifications, and implement people-based workflows.

## Acceptance Criteria

### Functional Requirements
- [ ] User can select "Calendar" resource and "List People" operation
- [ ] User can specify search queries to filter people
- [ ] User can filter by membership tier and member status
- [ ] User can configure pagination and sorting options
- [ ] Node returns paginated list of calendar people with complete metadata

### API Implementation
- **Endpoint:** `GET /public/v1/calendar/list-people`
- **Required Parameters:** None (all parameters are optional)
- **Optional Parameters:** 
  - `query` - Search over names and emails
  - `calendar_membership_tier_api_id` - Filter by membership tier
  - `member_status` - Filter by member status (relevant for Calendar Memberships)
  - `sort_direction` - asc, desc, asc nulls last, desc nulls last
  - `sort_column` - created_at, event_checked_in_count, event_approved_count, name, revenue_usd_cents
  - `pagination_cursor` - For pagination
  - `pagination_limit` - Number of items to return

### Data Structure
```typescript
interface CalendarPeopleListResponse {
  has_more: boolean;
  next_cursor?: string;
  entries: CalendarPerson[];
}

interface CalendarPerson {
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
  member_status?: string;
  membership_tier?: {
    api_id: string;
    name: string;
  };
  stats?: {
    event_checked_in_count: number;
    event_approved_count: number;
    revenue_usd_cents: number;
  };
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}
```

## Technical Implementation

### Node Configuration
```typescript
{
  displayName: 'Search Query',
  name: 'query',
  type: 'string',
  default: '',
  placeholder: 'Search over names and emails',
  displayOptions: {
    show: {
      resource: ['calendar'],
      operation: ['listPeople']
    }
  },
  description: 'Search filter for people names and emails'
},
{
  displayName: 'Sort Column',
  name: 'sortColumn',
  type: 'options',
  default: 'created_at',
  options: [
    { name: 'Created At', value: 'created_at' },
    { name: 'Name', value: 'name' },
    { name: 'Check-in Count', value: 'event_checked_in_count' },
    { name: 'Approved Count', value: 'event_approved_count' },
    { name: 'Revenue', value: 'revenue_usd_cents' }
  ],
  displayOptions: {
    show: {
      resource: ['calendar'],
      operation: ['listPeople']
    }
  }
}
```

### API Request Implementation
```typescript
const endpoint = '/public/v1/calendar/list-people';
const queryParams = new URLSearchParams();

if (query) queryParams.append('query', query);
if (membershipTierApiId) queryParams.append('calendar_membership_tier_api_id', membershipTierApiId);
if (memberStatus) queryParams.append('member_status', memberStatus);
if (sortDirection) queryParams.append('sort_direction', sortDirection);
if (sortColumn) queryParams.append('sort_column', sortColumn);
if (paginationCursor) queryParams.append('pagination_cursor', paginationCursor);
if (paginationLimit) queryParams.append('pagination_limit', paginationLimit.toString());

const response = await lumaApiRequest.call(this, 'GET', `${endpoint}?${queryParams}`);
```

## Use Cases

### Common Scenarios
1. **Member Directory**: List all calendar members for directory export
2. **Engagement Analysis**: Sort by check-in counts to identify active members
3. **Revenue Tracking**: Sort by revenue to identify high-value members
4. **Member Search**: Find specific members by name or email
5. **Tier Management**: Filter members by membership tier

### Workflow Examples
- Export member lists for external CRM systems
- Create engagement reports based on event participation
- Set up automated follow-ups for inactive members
- Generate revenue reports by member activity

## Error Handling

### Common Error Scenarios
1. **Authentication Errors** (401)
   - Invalid API key or expired credentials
   - **Response**: Clear error message about authentication

2. **Authorization Errors** (403)
   - Insufficient permissions to access calendar people
   - **Response**: Permission denied message

3. **Validation Errors** (400)
   - Invalid sort column or direction values
   - Invalid pagination parameters
   - **Response**: Specific validation error details

4. **Rate Limiting** (429)
   - Too many requests in time window
   - **Response**: Rate limit exceeded with retry guidance

## Dependencies
- Valid Luma API credentials with calendar access permissions
- Calendar must exist and be accessible by the authenticated user

## Testing Scenarios
1. List all people without filters
2. Search for specific members by name/email
3. Filter by membership tier
4. Sort by different columns and directions
5. Test pagination with large member lists
6. Handle empty results gracefully
7. Validate error responses for invalid parameters

---

**Story Points:** 5  
**Priority:** Medium  
**Epic:** [Epic 2: Calendar Operations](./epic.md)
