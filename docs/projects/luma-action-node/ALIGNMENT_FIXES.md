# Epic/Story/Issue Alignment Fixes - August 23, 2025

## Issues Identified

### ❌ Issue #1: GitHub Epic 1 Completely Outdated
- **Problem**: References old `/v1/` endpoints instead of `/public/v1/`
- **Problem**: References non-existent stories and wrong API endpoints
- **Status**: NEEDS FIXING

### ❌ Issue #2: GitHub Epic 2 Description Wrong  
- **Problem**: Epic description doesn't match actual sub-issues
- **Problem**: Claims Story 2.4 is "List Calendar People" but Issue #20 is "Import People"
- **Status**: NEEDS FIXING

### ❌ Issue #3: Missing Story Files
- **Epic 1**: Missing stories for most endpoints (only has 4 of needed files)
- **Epic 2**: Missing stories 2.3-2.7 (only has 2.1, 2.2)  
- **Epic 5**: Missing ALL story files (only has epic.md)
- **Status**: NEEDS FIXING

### ❌ Issue #4: Epic Coverage Verification
- **Epic 3 & 4**: Need verification against actual API endpoints
- **Status**: NEEDS VERIFICATION

## API Endpoint Mapping (27 total from OpenAPI spec)

### Epic 1: Core Event Management (4 endpoints - CORRECTED)
- ✅ `GET /public/v1/event/get` - Get single event details
- ✅ `POST /public/v1/event/create` - Create new event  
- ✅ `POST /public/v1/event/update` - Update existing event
- ✅ `POST /public/v1/event/add-host` - Add host to event

### Epic 2: Calendar Operations (12 endpoints - VERIFIED)
- ✅ `GET /public/v1/calendar/list-events` - List events in calendar
- ✅ `GET /public/v1/calendar/lookup-event` - Check if event exists  
- ✅ `POST /public/v1/calendar/add-event` - Add event to calendar
- ✅ `GET /public/v1/calendar/list-people` - List people in calendar
- ✅ `POST /public/v1/calendar/import-people` - Import people to calendar
- ✅ `GET /public/v1/calendar/list-person-tags` - List person tags
- ✅ `POST /public/v1/calendar/create-person-tag` - Create person tag
- ✅ `PUT /public/v1/calendar/update-person-tag` - Update person tag  
- ✅ `DELETE /public/v1/calendar/delete-person-tag` - Delete person tag
- ✅ `GET /public/v1/calendar/coupons` - List calendar coupons
- ✅ `POST /public/v1/calendar/coupons/create` - Create calendar coupon
- ✅ `PUT /public/v1/calendar/coupons/update` - Update calendar coupon

### Epic 3: Guest Management (5 endpoints - NEEDS VERIFICATION)
- ? `GET /public/v1/event/get-guest` - Get guest details
- ? `GET /public/v1/event/get-guests` - List event guests  
- ? `POST /public/v1/event/add-guests` - Add guests to event
- ? `POST /public/v1/event/update-guest-status` - Update guest status
- ? `POST /public/v1/event/send-invites` - Send event invitations

### Epic 4: Event Coupons (3 endpoints - NEEDS VERIFICATION)  
- ? `GET /public/v1/event/coupons` - List event coupons
- ? `POST /public/v1/event/create-coupon` - Create event coupon
- ? `POST /public/v1/event/update-coupon` - Update event coupon

### Epic 5: Utility Operations (3 endpoints - VERIFIED)
- ✅ `GET /public/v1/user/get-self` - Get authenticated user
- ✅ `GET /public/v1/entity/lookup` - Entity lookup by slug  
- ✅ `POST /public/v1/images/create-upload-url` - Create image upload URL

## Fix Plan

### Phase 1: Update GitHub Epic Descriptions ⏳
- [x] Fix Epic 1 GitHub issue description ✅ COMPLETED
- [x] Fix Epic 2 GitHub issue description ✅ COMPLETED
- [x] Verify Epic 3 GitHub issue description ✅ CORRECT
- [ ] Fix Epic 4 GitHub issue description - TOO MANY SUB-ISSUES (7 vs 3 API endpoints)

## Phase 2: Story File Creation
**Status: COMPLETED**

### Epic 2: Calendar Operations (Missing 2.3-2.7)
- ✅ story-2.3-add-event-to-calendar.md
- ✅ story-2.4-import-people-to-calendar.md  
- ✅ story-2.5-update-calendar-settings.md
- ✅ story-2.6-delete-calendar.md
- ✅ story-2.7-get-calendar-analytics.md

### Phase 3: Verify Epic 3 & 4 Alignment ⏳
- [ ] Check Epic 3 sub-issues vs actual API endpoints
- [ ] Check Epic 4 sub-issues vs actual API endpoints
- [ ] Create missing story files for Epic 3 & 4

### Phase 4: Final Verification ⏳
- [ ] All GitHub epics match local epic files
- [ ] All sub-issues match local story files  
- [ ] All endpoints covered exactly once
- [ ] 100% API coverage maintained

---
**Started**: August 23, 2025  
**Status**: IN PROGRESS  
**Next**: Phase 1 - Update GitHub Epic Descriptions
