# Luma Action Node - Product Requirements Document (PRD)

## Overview

This PRD defines the implementation requirements for a comprehensive Luma Action Node for n8n, enabling users to perform CRUD operations and manage events, guests, calendars, and related resources through Luma's API.

## Current State

✅ **Completed:**
- Basic Luma node scaffold with placeholder functionality
- Comprehensive Luma Trigger node for polling-based workflows  
- API credentials configuration
- Build system and project structure

## Target State

📋 **To Be Implemented:**
- Full-featured Luma Action Node with complete API coverage
- Support for all major Luma resources (Events, Calendars, Guests, etc.)
- CRUD operations following n8n best practices
- Error handling and validation
- Documentation and examples

## API Coverage Analysis

Based on Luma's actual API structure (`/public/v1/{resource}/{action}`), the action node should support:

### Core Resources (Based on Actual API)
1. **Events** - Primary resource for event management and guest operations
2. **Calendar** - List operations for events, people, and coupons
3. **Coupons** - Event and calendar-level discount management
4. **People & Tags** - Contact management and tagging system
5. **User** - Account information access
6. **Images** - Upload functionality for event assets
7. **Entity** - Lookup operations by slug

### Available Operations (Per Actual API)
- **Get/List** - Retrieve single resources or filtered collections
- **Create** - Add new events, coupons, tags, guests
- **Update** - Modify existing events, coupons, tags, guest status
- **Add/Import** - Add guests to events, import people to calendars
- **Send** - Send invitations and notifications
- **Delete** - Limited to person tags only
- **Lookup** - Entity resolution by slug

## Epic Structure (Aligned with GitHub Issues)

The implementation is organized into 4 main epics, each aligned with actual API capabilities and existing GitHub issues:

1. **Epic 1: Core Event Management** (`1-events/epic.md`) - Event CRUD and host management (GitHub Issue #10)
2. **Epic 2: Calendar Operations** (`2-calendars/epic.md`) - Calendar event listing, people management, and coupons (GitHub Issue #16)  
3. **Epic 3: Guest & RSVP Management** (`3-guests/epic.md`) - Event guest operations and status management (GitHub Issue #24)
4. **Epic 4: Ticket Management** (`4-tickets/epic.md`) - Coupon-based pricing and discount operations (GitHub Issue #34)

**Note:** The original documentation planned 7 epics, but after analyzing the actual Luma API specification, only 4 epics are needed to cover all available functionality. The API does not support many operations originally assumed (calendar CRUD, dedicated ticket management, separate user management).

## Implementation Principles

### n8n Node Patterns
- **Resource/Operation Pattern**: Following established n8n conventions
- **Progressive Disclosure**: Show relevant fields based on selection
- **Type Safety**: Full TypeScript coverage with proper error handling
- **Validation**: Input validation and API response handling

### API Integration Patterns  
- **RESTful Operations**: Support for GET/POST operations as per Luma conventions
- **Error Handling**: Proper handling of rate limits, validation errors, and API failures
- **Pagination**: Support for paginated responses where applicable
- **Authentication**: Secure API key management

### User Experience Patterns
- **Intuitive Flow**: Logical grouping of operations by resource
- **Clear Labeling**: Descriptive names and help text
- **Flexible Configuration**: Support for both simple and advanced use cases
- **Comprehensive Coverage**: Complete API surface coverage

## Success Criteria

### Functional Requirements
- ✅ All major Luma API endpoints are accessible
- ✅ Proper error handling and validation  
- ✅ Follows n8n community node standards
- ✅ Comprehensive test coverage
- ✅ Complete documentation

### Non-Functional Requirements
- ✅ Performance: Efficient API calls with proper caching
- ✅ Reliability: Robust error handling and retry logic
- ✅ Maintainability: Clean, well-documented code structure
- ✅ Usability: Intuitive user interface following n8n patterns

## Dependencies & Constraints

### Technical Dependencies
- Luma Plus subscription (API access requirement)
- Valid Luma API key
- n8n workflow environment
- Existing credential configuration

### API Constraints
- Rate limiting considerations
- All endpoints use `/public/v1/` prefix
- POST-based write operations (no PUT or DELETE for most operations)
- JSON request/response format
- Limited delete operations (only person tags)

## Risk Assessment

### High Priority Risks
1. **API Limitations**: Not all expected CRUD operations are available
2. **Rate Limiting**: Potential throttling with high-volume operations
3. **Complex Data Models**: Rich event/guest data structures
4. **Limited Calendar Management**: No direct calendar CRUD operations

### Mitigation Strategies
1. **Scope Management**: Focus on available operations rather than assumed ones
2. **Rate Limit Handling**: Implement exponential backoff and retry logic
3. **Data Validation**: Comprehensive input/output validation
4. **Alternative Workflows**: Use available operations to achieve desired outcomes

## Timeline & Delivery

### Implementation Order (Revised for Actual API)
1. **Epic 1: Core Event Management** - Foundation operations (create, update, get)
2. **Epic 2: Event Guest Operations** - High-value user scenarios (add, invite, status updates)
3. **Epic 3: Calendar List Operations** - Discovery and listing features
4. **Epic 4: Coupon Management** - Marketing and discount features
5. **Epic 5: People & Tag Management** - Contact organization features
6. **Epic 6: Utility Operations** - Supporting features (lookup, upload, user info)

### Delivery Strategy
- Each epic can be implemented and tested independently
- Core functionality (Events + Guests) provides immediate value
- Advanced features can be added incrementally
- Parallel development possible for different epics

## Next Steps

1. 📖 **Review Epic Documentation**: Start with `1-events/epic.md`
2. 🏗️ **Implementation**: Begin with core event operations
3. 🧪 **Testing**: Validate against live Luma API endpoints
4. 📚 **Documentation**: Update README and usage examples
5. 🚀 **Release**: Package and publish to npm registry
