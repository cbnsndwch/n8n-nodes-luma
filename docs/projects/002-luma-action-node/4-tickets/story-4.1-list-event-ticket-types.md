# [PROJ_002] Story 4.1: List Event Ticket Types

**As a** workflow developer  
**I want to** retrieve all ticket types for a specific event  
**So that** I can understand pricing structure and availability

## Acceptance Criteria
- ✅ Support event ID input (required)
- ✅ Return list of ticket types with pricing and availability
- ✅ Support filtering by ticket status (active, hidden, sold out)
- ✅ Include sales statistics for each ticket type

## Technical Implementation
```typescript
// Resource: Ticket
// Operation: List
// Parameters:
{
  eventId: string (required),
  additionalFields: {
    status?: 'active' | 'hidden' | 'archived',
    includeStats?: boolean,
    includeSoldOut?: boolean,
    sortBy?: 'price' | 'name' | 'created_at' | 'sales_count'
  }
}
```

## Test Cases
- List all ticket types for event
- Filter by active ticket types only
- Include sales statistics
- Sort by different criteria
- Handle event with no ticket types

## API Endpoint
`GET /v1/event/ticket-types/list`

## Story Points
**3**

## Priority
**High**
