import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WorkoutExerciseDetailEntity } from "../entities/workout-exercise-detail.entity";

@Injectable()
export class WorkoutExerciseDetailRepository extends Repository<WorkoutExerciseDetailEntity> {
    constructor(private datasource: DataSource) {
        super(WorkoutExerciseDetailEntity, datasource.createEntityManager());
    }
}