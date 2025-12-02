import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WorkoutProgramPlanEntity } from "../entities/workout-program-plan.entity";

@Injectable()
export class WorkoutProgramPlanRepository extends Repository<WorkoutProgramPlanEntity> {
    constructor(private datasource: DataSource) {
        super(WorkoutProgramPlanEntity, datasource.createEntityManager());
    }
}