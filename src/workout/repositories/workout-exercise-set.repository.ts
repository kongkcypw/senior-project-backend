import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { WorkoutExerciseSetEntity } from "../entities/workout-exercise-set.entity";
import { DataSource } from "typeorm";

@Injectable()
export class WorkoutExerciseSetRepository extends Repository<WorkoutExerciseSetEntity> {
    constructor(private datasource: DataSource) {
        super(WorkoutExerciseSetEntity, datasource.createEntityManager());
    }
}