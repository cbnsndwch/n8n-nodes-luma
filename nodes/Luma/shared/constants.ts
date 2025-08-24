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

    // Calendar endpoints
    CALENDAR_LIST_EVENTS: '/public/v1/calendar/list-events',
    CALENDAR_LOOKUP_EVENT: '/public/v1/calendar/lookup-event',
    CALENDAR_ADD_EVENT: '/public/v1/calendar/add-event',
    CALENDAR_LIST_PEOPLE: '/public/v1/calendar/list-people',
    CALENDAR_IMPORT_PEOPLE: '/public/v1/calendar/import-people',
    CALENDAR_LIST_PERSON_TAGS: '/public/v1/calendar/list-person-tags',
    CALENDAR_LIST_COUPONS: '/public/v1/calendar/list-coupons',

    // Utility endpoints
    ENTITY_LOOKUP: '/public/v1/entity/lookup',
    IMAGE_CREATE_UPLOAD_URL: '/public/v1/images/create-upload-url'
} as const;
