import type { ResourceHandler } from './shared/contracts';
import { ResourceId } from './shared/props';

import { handleCalendarOperation } from './calendar/operations';
import { handleEventOperation } from './event/operations';
import { handleGuestOperation } from './guest/operations';
import { handleUserOperation } from './user/operations';
import { handleUtilityOperation } from './utility/operations';

export const RESOURCE_HANDLERS: Record<ResourceId, ResourceHandler> = {
    calendar: handleCalendarOperation,
    event: handleEventOperation,
    guest: handleGuestOperation,
    user: handleUserOperation,
    utility: handleUtilityOperation
} as const;
