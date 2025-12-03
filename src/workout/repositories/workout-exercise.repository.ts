import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WorkoutExerciseEntity } from "../entities/workout-exercise.entity";

@Injectable()
export class WorkoutExerciseRepository extends Repository<WorkoutExerciseEntity> {
    constructor(private datasource: DataSource) {
        super(WorkoutExerciseEntity, datasource.createEntityManager());
    }
}