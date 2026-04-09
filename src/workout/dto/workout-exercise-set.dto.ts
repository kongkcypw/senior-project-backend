import { Exclude, Expose } from "class-transformer";

export class WorkoutExerciseSetDto {

    @Expose()
    id: number;

    @Expose()
    set: number;

    @Expose()
    rep: number;

    @Expose()
    weightKg: number | null;

    @Exclude()
    exerciseId: number;

    @Exclude()
    createdAt: Date;

    @Exclude()
    updatedAt: Date;
}