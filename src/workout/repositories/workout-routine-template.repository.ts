import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WorkoutRoutineTemplateEntity } from "../entities/workout-routine-template.entity";

@Injectable()
export class WorkoutRoutineTemplateRepository extends Repository<WorkoutRoutineTemplateEntity> {
    constructor(private datasource: DataSource) {
        super(WorkoutRoutineTemplateEntity, datasource.createEntityManager());
    }
}