import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DevAuthGuard } from '../auth/guards/dev-auth.guard'; 

const isLocal = process.env.NODE_ENV === 'local';

export function getProtectedGuards(liffAuthStrategyName: string) {
    const guards: any[] = [];

    if (isLocal) {
        // LOCAL: Use DevAuthGuard followed directly by RolesGuard 
        guards.push(DevAuthGuard);
    } else {
        // PRODUCTION: Use real LIFF Auth 
        guards.push(AuthGuard(liffAuthStrategyName));
    }
    
    // RolesGuard runs in both environments, checking req.user (placed by the preceding guard)
    guards.push(RolesGuard);

    return guards;
}