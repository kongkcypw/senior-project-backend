import { Exclude, Expose, plainToInstance, Type } from "class-transformer";
import { WorkoutExerciseTemplateEntity } from "../entities/workout-exercise-template.entity";
import { WorkoutExerciseSetDto } from "./workout-exercise-set.dto";

export class WorkoutExerciseTemplateDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    imageUrl: string | null;

    // Use the @Type decorator and Expose the array property directly
    @Expose()
    @Type(() => WorkoutExerciseSetDto)
    sets: Array<WorkoutExerciseSetDto>;

    @Expose()
    isTemplate: true = true;

    @Exclude()
    createdAt: Date;

    @Exclude()
    updatedAt: Date;

    // --- CRITICAL FIX: Custom mapping to ensure key existence ---
    static fromEntityToDto(rawData: WorkoutExerciseTemplateEntity): WorkoutExerciseTemplateDto {
        // 1. Map the raw data using plainToInstance for basic properties
        const transformedDto = plainToInstance(WorkoutExerciseTemplateDto, rawData);

        // 2. Manually ensure the ExerciseSet property exists and is an array.
        // Since templates don't have sets, we manually set it to an empty array.
        if (!transformedDto.sets) {
            transformedDto.sets = [];
        }

        return transformedDto;
    }
}