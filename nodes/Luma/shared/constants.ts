/**
 * Shared constants for Luma nodes
 */

export const LUMA_API_BASE_URL = 'https://public-api.lu.ma';
export const LUMA_API_VERSION = 'v1';
export const LUMA_API_BASE_PATH = '/public/v1';

/**
 * Helper function to build Luma API URLs
 */
export function buildLumaApiUrl(endpoint: string): string {
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/')
        ? endpoint.slice(1)
        : endpoint;
    return `${LUMA_API_BASE_URL}/${cleanEndpoint}`;
}

/**
 * Predefined Luma API endpoints
 */
export const LUMA_ENDPOINTS = {
    // User endpoints
    USER_GET_SELF: '/public/v1/user/get-self',

    // Event endpoints
    EVENT_GET: '/public/v1/event/get',
    EVENT_CREATE: '/public/v1/event/create',
    EVENT_UPDATE: '/public/v1/event/update',
    EVENT_DELETE: '/public/v1/event/delete',
    EVENT_GET_GUESTS: '/public/v1/event/get-guests',
    EVENT_LIST_COUPONS: '/public/v1/event/coupons',
    EVENT_CREATE_COUPON: '/public/v1/event/create-coupon',
    EVENT_UPDATE_COUPON: '/public/v1/event/update-coupon',

    // Guest endpoints
    GUEST_GET: '/public/v1/guest/get',
    EVENT_ADD_GUESTS: '/public/v1/event/add-guests',
    UPDATE_GUEST_STATUS: '/public/v1/event/update-guest-status',
    GUEST_APPROVE: '/v1/guest/approve',
    GUEST_REJECT: '/v1/guest/reject',
    GUEST_CANCEL: '/v1/guest/cancel',

    // Ticket endpoints
    TICKET_TYPES_LIST: '/public/v1/event/ticket-types/list',
    TICKET_TYPE_GET: '/public/v1/event/ticket-types/get',
    TICKET_TYPE_CREATE: '/public/v1/event/ticket-types/create',
    TICKET_TYPE_DELETE: '/public/v1/event/ticket-types/delete',
    TICKET_TYPES_BULK_UPDATE: '/v1/event/ticket-types/bulk-update',

    // Calendar endpoints
    CALENDAR_LIST_EVENTS: '/public/v1/calendar/list-events',
    CALENDAR_LOOKUP_EVENT: '/public/v1/calendar/lookup-event',
    CALENDAR_ADD_EVENT: '/public/v1/calendar/add-event',
    CALENDAR_LIST_PEOPLE: '/public/v1/calendar/list-people',
    CALENDAR_IMPORT_PEOPLE: '/public/v1/calendar/import-people',
    CALENDAR_LIST_PERSON_TAGS: '/public/v1/calendar/list-person-tags',
    CALENDAR_UPDATE_PERSON_TAG: '/public/v1/calendar/update-person-tag',
    CALENDAR_DELETE_PERSON_TAG: '/public/v1/calendar/delete-person-tag',
    CALENDAR_CREATE_PERSON_TAG: '/public/v1/calendar/create-person-tag',
    CALENDAR_LIST_COUPONS: '/public/v1/calendar/coupons',
    CALENDAR_CREATE_COUPON: '/public/v1/calendar/coupons/create',
    CALENDAR_UPDATE_COUPON: '/public/v1/calendar/coupons/update',

    // Utility endpoints
    ENTITY_LOOKUP: '/public/v1/entity/lookup',
    IMAGE_CREATE_UPLOAD_URL: '/public/v1/images/create-upload-url'
} as const;
