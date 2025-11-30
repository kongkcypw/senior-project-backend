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
  displayName: string | null;

  @IsString()
  @Expose()
  pictureUrl?: string | null;

  @IsString()
  @Expose()
  role: string | null;
}