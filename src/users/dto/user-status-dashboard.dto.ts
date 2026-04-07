import { Expose } from 'class-transformer';
import { IsBoolean, IsInt, IsString } from 'class-validator';

export class UserStatusDashboardDto {
    @Expose()
    @IsInt()
    id: number;

    @Expose()
    @IsString()
    lineUserId: string;

    @Expose()
    @IsString()
    displayName: string | null;

    @Expose()
    @IsString()
    pictureUrl: string | null;

    @IsString()
    @Expose()
    role: string | null;

    @Expose()
    @IsBoolean()
    isTrainer: boolean;

    @Expose()
    @IsBoolean()
    isActiveTrainee: boolean;
}