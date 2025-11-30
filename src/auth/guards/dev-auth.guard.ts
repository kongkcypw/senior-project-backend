// src/auth/dev-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { MockUsers } from 'db/seeds/01-users.seed';
import { UserService } from 'src/users/services/user.service';

@Injectable()
export class DevAuthGuard implements CanActivate {
  constructor(
    private readonly userService: UserService
) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (authHeader?.startsWith('Bearer MOCK_LOCAL_ID_TOKEN')) {
      const testUserLineId = MockUsers.TRAINER_USER_001.lineUserId;
      const testUser = await this.userService.findByLineUserId(testUserLineId);

      if (testUser) {
        // Manually attach the UserEntity to the request (faking req.user)
        request.user = testUser; 
        return true; // Access granted
      }
    }
    
    // If it's not the mock token, let the next guard (LiffAuthGuard) run
    return false; 
  }
}