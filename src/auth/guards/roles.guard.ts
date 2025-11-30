import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/enums/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from the @Roles() decorator metadata
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles required, access granted
    }

    // Get the authenticated user object (from req.user)
    // This is available because LiffAuthGuard has run successfully.
    const { user } = context.switchToHttp().getRequest<{ user: UserEntity }>();

    if (!user || !user.role) {
      // User is authenticated but somehow role is missing (shouldn't happen with LiffAuthGuard)
      return false; 
    }

    // Check if the user's role is included in the required roles
    return requiredRoles.includes(user.role as UserRole);
  }
}