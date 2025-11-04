import { Expose } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

/**
 * DTO for returning user info (response DTO).
 */
export class UserInfoDto {
  @IsInt()
  @Expose()
  id: number;

  @IsString()
  @Expose()
  lineUserId: string;

  @IsString()
  @Expose()
  displayName: string;

  @IsString()
  @Expose()
  role: string;
}