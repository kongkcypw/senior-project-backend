import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WorkoutHistoryExerciseEntity } from "../entities/workout-history-exercise.entity";

@Injectable()
export class WorkoutHistoryExerciseRepository extends Repository<WorkoutHistoryExerciseEntity> {
    constructor(private datasource: DataSource) {
        super(WorkoutHistoryExerciseEntity, datasource.createEntityManager());
    }

    async saveExerciseLogs(
        workoutHistoryRoutineId: number,
        sets: Array<{ exerciseId: number; setNumber: number; reps: number; weightKg: number | null; notes?: string }>,
    ): Promise<void> {
        const entities = sets.map(s =>
            this.create({
                workoutHistoryRoutineId,
                exerciseId: s.exerciseId,
                setNumber: s.setNumber,
                rep: s.reps,
                weightKg: s.weightKg ?? null,
                notes: s.notes ?? null,
            }),
        );
        await this.save(entities);
    }
}
