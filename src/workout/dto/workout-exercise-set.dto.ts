import { Expose } from "class-transformer";

export class WorkoutExerciseSetDto {

    @Expose()
    id: number;

    @Expose()
    exerciseId: number;

    @Expose({ name: 'setNumber' })
    setNumber: number;

    @Expose()
    reps: number;

    @Expose()
    weightKg: number | null;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}