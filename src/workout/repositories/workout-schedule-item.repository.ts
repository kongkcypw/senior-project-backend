import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WorkoutScheduleItemEntity } from "../entities/workout-schedule-item.entity";

@Injectable()
export class WorkoutScheduleItemRepository extends Repository<WorkoutScheduleItemEntity> {
    constructor(private datasource: DataSource) {
        super(WorkoutScheduleItemEntity, datasource.createEntityManager());
    }
}