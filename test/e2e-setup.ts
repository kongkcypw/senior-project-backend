// Must run before any module imports so guards.util.ts sees NODE_ENV = 'local'
// and returns [DevAuthGuard, RolesGuard] instead of the real LIFF passport guard.
process.env.NODE_ENV = 'local';

import { initializeTransactionalContext } from 'typeorm-transactional';
initializeTransactionalContext();
