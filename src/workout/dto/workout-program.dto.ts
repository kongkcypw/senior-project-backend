import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import { WorkoutRoutineDto } from './workout-routine.dto'; // Renamed import
import { WorkoutProgramEntity } from '../entities/workout-program.entity'; // Renamed import

export class WorkoutProgramDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    lineUserIdTrainee: string;

    @Expose()
    lineUserIdTrainer: string;

    @Expose()
    orderInProgram: number;

    // Nested collections
    @Expose({ name: 'routines' }) // Renamed property and exposed name
    @Type(() => WorkoutRoutineDto)
    routines: WorkoutRoutineDto[];

    // Removed scheduleItems property

    @Exclude()
    createdAt: Date;

    @Exclude()
    updatedAt: Date;

    static fromEntityToDto(rawData: WorkoutProgramEntity): WorkoutProgramDto {
        const transformedDto = plainToInstance(WorkoutProgramDto, rawData);
        return transformedDto;
    }
}