import { Injectable } from "@nestjs/common";
import { WorkoutDayDefinitionEntity } from "../entities/workout-day-definition.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class WorkoutDayDefinitionRepository extends Repository<WorkoutDayDefinitionEntity> {
    constructor(private datasource: DataSource) {
        super(WorkoutDayDefinitionEntity, datasource.createEntityManager());
    }

}