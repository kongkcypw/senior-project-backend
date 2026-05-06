import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/users/enums/user-role.enum';
import { UserInfoDto } from 'src/users/dto/user-info.dto';
import { UserRelationshipsService } from 'src/users/services/user-relationships.service';
import { SKIP_TRAINER_GUARD_KEY } from '../decorators/skip-trainer-guard.decorator';

@Injectable()
export class AssignedTrainerGuard implements CanActivate {

  constructor(
    private readonly userRelationshipsService: UserRelationshipsService,
    private readonly reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_TRAINER_GUARD_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skip) return true;

    const request = context.switchToHttp().getRequest();

    // The authenticated viewer (placed by LiffJwtStrategy)
    const viewer: UserInfoDto = request.user;

    if (!viewer) {
      console.warn(`[AssignedTrainerGuard] BLOCK — request.user is undefined for ${request.method} ${request.url} (JWT auth did not set user)`);
      throw new UnauthorizedException('Authentication required.');
    }

    // The target user ID from route param, body, or query string
    const targetLineUserId = request.params?.lineUserId || request.body?.lineUserId || request.query?.lineUserId;

    console.log(`[AssignedTrainerGuard] ${request.method} ${request.url} | viewer: ${viewer.lineUserId} (${viewer.role}) | target: ${targetLineUserId} | params: ${JSON.stringify(request.params)} | query: ${JSON.stringify(request.query)}`);

    // Authorization Check: Self-Access (Trainee viewing their own data)
    // The Trainee can always view their own history.
    if (viewer.lineUserId === targetLineUserId) {
      console.log('[AssignedTrainerGuard] PASS — self-access');
      return true;
    }

    // Role Check: Only TRAINERS can view other users data.
    // If a Trainee tries to view another Trainee's data
    if (viewer.role !== UserRole.TRAINER) {
      console.warn(`[AssignedTrainerGuard] BLOCK — viewer is ${viewer.role}, not TRAINER`);
      throw new ForbiddenException('Only assigned trainer can view other trainee data.');
    }

    // Relationship Check: Is the Viewer the ASSIGNED Trainer of the Target Trainee?
    const isAssignedTrainer = await this.userRelationshipsService.isAssignedTrainerForTrainee(
      viewer.lineUserId, // The Trainer's ID (the Viewer)
      targetLineUserId  // The Trainee's ID
    );

    if (isAssignedTrainer) {
      console.log('[AssignedTrainerGuard] PASS — assigned trainer');
      return true;
    }

    // If the viewer is a Coach but is not assigned to this Client.
    console.warn(`[AssignedTrainerGuard] BLOCK — ${viewer.lineUserId} is not assigned trainer for ${targetLineUserId}`);
    throw new ForbiddenException('You are not the assigned trainer for this client.');
  }
}