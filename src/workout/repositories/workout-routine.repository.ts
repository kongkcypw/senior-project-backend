import { Injectable } from "@nestjs/common";
import { WorkoutRoutineEntity } from "../entities/workout-routine.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class WorkoutRoutineRepository extends Repository<WorkoutRoutineEntity> {
    constructor(private datasource: DataSource) {
        super(WorkoutRoutineEntity, datasource.createEntityManager());
    }

}