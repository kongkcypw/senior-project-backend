import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import { WorkoutDayDefinitionDto } from './workout-day-definition.dto';
import { WorkoutScheduleItemDto } from './workout-schedule-item.dto';
import { WorkoutProgramPlanEntity } from '../entities/workout-program-plan.entity';

export class WorkoutProgramPlanDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    // Simplified naming for the frontend
    @Expose()
    lineUserIdTrainee: string | null;

    @Expose()
    lineUserIdTrainer: string;

    @Expose()
    notes: string | null;

    @Expose()
    isActive: boolean;

    @Expose()
    startDate: Date | null;

    @Expose()
    endDate: Date | null;

    // Nested collections
    @Expose()
    @Type(() => WorkoutDayDefinitionDto)
    dayDefinitions: WorkoutDayDefinitionDto[];

    @Expose()
    @Type(() => WorkoutScheduleItemDto)
    scheduleItems: WorkoutScheduleItemDto[];

    // Exclude all database timestamps
    @Exclude()
    createdAt: Date;

    @Exclude()
    updatedAt: Date;

/**
   * Transforms the raw workout program plan data
   * into the structured WorkoutProgramPlanDto, applying all class-transformer rules.
   * The DTO's decorators handle all nested transformations
   * @param rawData WorkoutProgramPlanEntity instance to transform.
   * @returns An instance of WorkoutProgramPlanDto.
   */
    static fromEntityToDto(rawData: WorkoutProgramPlanEntity): WorkoutProgramPlanDto {
        const transformedDto = plainToInstance(WorkoutProgramPlanDto, rawData);

        return transformedDto;
    }
}