import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WorkoutHistoryEntity } from "../entities/workout-history.entity";

@Injectable()
export class WorkoutHistoryRepository extends Repository<WorkoutHistoryEntity> {
    constructor(private datasource: DataSource) {
        super(WorkoutHistoryEntity, datasource.createEntityManager());
    }
}