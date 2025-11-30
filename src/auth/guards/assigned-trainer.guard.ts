import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserService } from 'src/users/services/user.service';
import { UserRole } from 'src/users/enums/user-role.enum';
import { UserInfoDto } from 'src/users/dto/user-info.dto';
import { UserRelationshipsService } from 'src/users/services/user-relationships.service';

@Injectable()
export class AssignedTrainerGuard implements CanActivate {

  // Inject the UserService to perform the database lookup
  constructor(private readonly userRelationshipsService: UserRelationshipsService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // The authenticated viewer (placed by LiffJwtStrategy)
    const viewer: UserInfoDto = request.user;

    // The target user ID from the route parameter (the Trainee/Client)
    const targetLineUserId = request.params.lineUserId || request.body.lineUserId;

    // Authorization Check: Self-Access (Trainee viewing their own data)
    // The Trainee can always view their own history.
    if (viewer.lineUserId === targetLineUserId) {
      return true;
    }

    // Role Check: Only TRAINERS can view other users data.
    // If a Trainee tries to view another Trainee's data
    if (viewer.role !== UserRole.TRAINER) {
      throw new ForbiddenException('Only assigned trainer can view other trainee data.');
    }

    // Relationship Check: Is the Viewer the ASSIGNED Trainer of the Target Trainee?
    const isAssignedTrainer = await this.userRelationshipsService.isAssignedTrainerForTrainee(
      viewer.lineUserId, // The Trainer's ID (the Viewer)
      targetLineUserId  // The Trainee's ID
    );

    if (isAssignedTrainer) {
      return true;
    }

    // If the viewer is a Coach but is not assigned to this Client.
    throw new ForbiddenException('You are not the assigned trainer for this client.');
  }
}