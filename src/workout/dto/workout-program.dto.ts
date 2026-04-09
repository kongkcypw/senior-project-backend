import { Exclude, Expose, plainToInstance, Type } from 'class-transformer';
import { WorkoutRoutineDto } from './workout-routine.dto'; // Renamed import
import { WorkoutProgramEntity } from '../entities/workout-program.entity'; // Renamed import

export class WorkoutProgramTraineeDto {
    @Expose()
    lineUserId!: string;

    @Expose()
    displayName!: string | null;

    @Expose()
    pictureUrl!: string | null;
}

export class WorkoutProgramDto {
    @Expose()
    id!: number;

    @Expose()
    name!: string;

    @Expose()
    lineUserIdTrainee!: string;

    @Expose()
    lineUserIdTrainer!: string;

    @Expose()
    orderInProgram!: number;

    // Trainee owner (only populated when the query joins the trainee relation)
    @Expose()
    @Type(() => WorkoutProgramTraineeDto)
    trainee?: WorkoutProgramTraineeDto;

    // Nested collections
    @Expose({ name: 'routines' }) // Renamed property and exposed name
    @Type(() => WorkoutRoutineDto)
    routines!: WorkoutRoutineDto[];

    // Removed scheduleItems property

    @Expose()
    createdAt!: Date;

    @Exclude()
    updatedAt!: Date;

    static fromEntityToDto(rawData: WorkoutProgramEntity): WorkoutProgramDto {
        const transformedDto = plainToInstance(WorkoutProgramDto, rawData);
        return transformedDto;
    }
}