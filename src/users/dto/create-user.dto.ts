import { UserRole } from "../enums/user-role.enum";

export class CreateUserDto {
    lineUserId: string;
    displayName?: string | null;
    role: UserRole;
    pictureUrl?: string | null;
}