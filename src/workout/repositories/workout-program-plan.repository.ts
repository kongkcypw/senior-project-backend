import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WorkoutProgramPlanEntity } from "../entities/workout-program-plan.entity";

@Injectable()
export class WorkoutProgramPlanRepository extends Repository<WorkoutProgramPlanEntity> {
    constructor(private datasource: DataSource) {
        super(WorkoutProgramPlanEntity, datasource.createEntityManager());
    }

        /**
     * Retrieves the complete workout program plan, including all associated day definitions,
     * exercises, and scheduling items.
     * @param programPlanId The ID of the program plan to retrieve.
     * @returns The full WorkoutProgramPlanEntity with eagerly loaded relations.
     */
    async findFullProgramByProgramPlanId(programPlanId: number): Promise<WorkoutProgramPlanEntity | null> {
        return this.createQueryBuilder('plan')
            .leftJoinAndSelect('plan.dayDefinitions', 'dayDef')
            .leftJoinAndSelect('dayDef.exerciseDetails', 'exerciseDetail')
            .leftJoinAndSelect('plan.scheduleItems', 'scheduleItem')
            .where('plan.id = :id', { id: programPlanId })
            .orderBy('dayDef.id', 'ASC')
            .addOrderBy('exerciseDetail.orderInDay', 'ASC')
            .addOrderBy('scheduleItem.id', 'ASC')
            .getOne();
    }
}