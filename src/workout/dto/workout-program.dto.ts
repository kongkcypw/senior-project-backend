import { Exclude, Expose, Type } from 'class-transformer';
import { WorkoutProgramEntity } from '../entities/workout-program.entity';

export class WorkoutProgramTraineeDto {
    @Expose()
    lineUserId!: string;

    @Expose()
    displayName!: string | null;

    @Expose()
    pictureUrl!: string | null;
}

export class WorkoutExerciseSetResponseDto {
    id!: number;
    set!: number;
    rep!: number;
    weightKg!: number | null;
}

export class WorkoutExerciseResponseDto {
    id!: number;
    name!: string;
    imageUrl!: string | null;
    orderInRoutine!: number;
    description!: string | null;
    setDetails!: WorkoutExerciseSetResponseDto[];
}

export class WorkoutRoutineResponseDto {
    id!: number;
    name!: string;
    orderInProgram!: number;
    exercises!: WorkoutExerciseResponseDto[];
}

export class WorkoutProgramDto {
    @Expose()
    id!: number;

    @Expose()
    name!: string;

    @Expose()
    lineUserIdTrainee!: string;

    @Expose()
    lineUserIdTrainer!: string | null;

    @Expose()
    orderInWorkout!: number;

    @Expose()
    @Type(() => WorkoutProgramTraineeDto)
    trainee?: WorkoutProgramTraineeDto;

    @Expose()
    routines!: WorkoutRoutineResponseDto[];

    @Expose()
    createdAt!: Date;

    @Exclude()
    updatedAt!: Date;

    static fromEntityToDto(entity: WorkoutProgramEntity): WorkoutProgramDto {
        const dto = new WorkoutProgramDto();

        dto.id               = entity.id;
        dto.name             = entity.name;
        dto.lineUserIdTrainee = entity.lineUserIdTrainee;
        dto.lineUserIdTrainer = entity.lineUserIdTrainer;
        dto.orderInWorkout   = entity.orderInWorkout;
        dto.createdAt        = entity.createdAt;

        if (entity.trainee) {
            const t = new WorkoutProgramTraineeDto();
            t.lineUserId   = entity.trainee.lineUserId;
            t.displayName  = entity.trainee.displayName;
            t.pictureUrl   = entity.trainee.pictureUrl;
            dto.trainee = t;
        }

        dto.routines = (entity.routines ?? []).map((routine) => {
            const r = new WorkoutRoutineResponseDto();
            r.id             = routine.id;
            r.name           = routine.name;
            r.orderInProgram = routine.orderInProgram;

            r.exercises = (routine.exercises ?? []).map((exercise) => {
                const e = new WorkoutExerciseResponseDto();
                e.id             = exercise.id;
                e.name           = exercise.name;
                e.imageUrl       = exercise.imageUrl;
                e.orderInRoutine = exercise.orderInRoutine;
                e.description    = exercise.description;

                e.setDetails = (exercise.setDetails ?? []).map((s) => {
                    const sd = new WorkoutExerciseSetResponseDto();
                    sd.id       = s.id;
                    sd.set      = s.set;
                    sd.rep      = s.rep;
                    sd.weightKg = s.weightKg;
                    return sd;
                });

                return e;
            });

            return r;
        });

        return dto;
    }
}
