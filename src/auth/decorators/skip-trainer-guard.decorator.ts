import { SetMetadata } from '@nestjs/common';

export const SKIP_TRAINER_GUARD_KEY = 'skipAssignedTrainerGuard';

/**
 * Apply on individual route handlers that do NOT carry a `lineUserId` param
 * representing a target trainee (e.g. GET /detail/:programId).
 * AssignedTrainerGuard will pass through for those routes.
 */
export const SkipAssignedTrainerGuard = () => SetMetadata(SKIP_TRAINER_GUARD_KEY, true);
