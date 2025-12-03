import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import { WorkoutDayDefinitionDto } from './workout-day-definition.dto';
// import { WorkoutScheduleItemDto } from './workout-schedule-item.dto'; // Removed
import { WorkoutProgramPlanEntity } from '../entities/workout-program-plan.entity';

export class WorkoutProgramPlanDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    lineUserIdTrainee: string;

    @Expose()
    lineUserIdTrainer: string;

    @Expose()
    @Type(() => WorkoutDayDefinitionDto)
    dayDefinitions: WorkoutDayDefinitionDto[];

    @Exclude()
    createdAt: Date;

    @Exclude()
    updatedAt: Date;

    static fromEntityToDto(rawData: WorkoutProgramPlanEntity): WorkoutProgramPlanDto {
        const transformedDto = plainToInstance(WorkoutProgramPlanDto, rawData);
        return transformedDto;
    }
}