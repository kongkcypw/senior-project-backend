import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInfoDto } from 'src/users/dto/user-info.dto'; // Use the DTO for type safety

/**
 * Custom decorator to retrieve the authenticated entity (the Viewer) 
 * placed on req.user by the LiffJwtStrategy.
 */
export const Viewer = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserInfoDto => {
    const request = ctx.switchToHttp().getRequest();
    // LiffJwtStrategy places the authenticated UserInfoDto object at req.user
    return request.user; 
  },
);