import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard'; 
import { AssignedTrainerGuard } from 'src/auth/guards/assigned-trainer.guard';

const isLocal = process.env.NODE_ENV === 'local';

export function getProtectedGuards(liffAuthStrategyName: string) {
    const guards: any[] = [];

    if (isLocal) {
        // LOCAL: Use DevAuthGuard followed directly by RolesGuard 
        guards.push(DevAuthGuard);
        guards.push(RolesGuard);
        return guards;
    } else {
        // PRODUCTION: Use real LIFF Auth 
        guards.push(AuthGuard(liffAuthStrategyName));
    }
    
    // RolesGuard runs in both environments, checking req.user (placed by the preceding guard)
    guards.push(RolesGuard);

    // Authorization Check for Assigned Trainer or Self-Access
    guards.push(AssignedTrainerGuard);

    return guards;
}