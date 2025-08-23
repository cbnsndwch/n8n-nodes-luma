# Story 6.4: Update Person Information

**As a** workflow developer  
**I want to** modify person profile information  
**So that** I can keep community member data current

## Epic Reference
This story is part of [Epic 6: People Management](./epic.md)

## Acceptance Criteria
- ✅ Support person ID identification
- ✅ Allow partial updates of profile fields
- ✅ Handle contact preference updates
- ✅ Maintain data privacy and consent

## Technical Implementation
```typescript
// Resource: People
// Operation: Update Person
// Parameters:
{
  personId: string (required),
  updateFields: {
    // Basic Profile
    firstName?: string,
    lastName?: string,
    email?: string,
    phone?: string,
    bio?: string,
    
    // Professional Info
    title?: string,
    company?: string,
    industry?: string,
    website?: string,
    
    // Location
    city?: string,
    country?: string,
    timezone?: string,
    
    // Social Profiles
    linkedinUrl?: string,
    twitterHandle?: string,
    instagramHandle?: string,
    
    // Contact Preferences
    emailNotifications?: boolean,
    smsNotifications?: boolean,
    eventReminders?: boolean,
    marketingEmails?: boolean,
    
    // Custom Fields
    customFields?: Record<string, any>
  },
  additionalFields: {
    updateSource?: string, // track who/what made the update
    bypassValidation?: boolean,
    notifyPersonOfChanges?: boolean,
    auditReason?: string
  }
}
```

## API Endpoint
- `POST /v1/person/update`

## Test Cases
- Update single field preserves others
- Email changes trigger verification
- Contact preferences updated correctly
- Custom fields handled properly
- Invalid updates return appropriate errors
- Audit trail maintained

## Priority
Medium

## Story Points
5

## Dependencies
- Person must exist
- Proper authentication and permissions
- Data privacy compliance

## Definition of Done
- [ ] Implementation follows n8n node patterns
- [ ] Input validation and error handling
- [ ] TypeScript interfaces defined
- [ ] Unit tests written and passing
- [ ] Integration tests with real API
- [ ] Documentation updated
