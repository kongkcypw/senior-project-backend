import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WorkoutProgramEntity } from "../entities/workout-program.entity";

@Injectable()
export class WorkoutProgramPlanRepository extends Repository<WorkoutProgramEntity> {
    constructor(private datasource: DataSource) {
        super(WorkoutProgramEntity, datasource.createEntityManager());
    }

    /**
     * Retrieves the complete workout program, including all associated routines,
     * exercises.
     * @param programPlanId The ID of the program to retrieve.
     * @returns The full WorkoutProgramEntity with eagerly loaded relations.
     */
    async findFullProgramByProgramPlanId(programPlanId: number): Promise<WorkoutProgramEntity | null> {
        return this.createQueryBuilder('plan')
            .leftJoinAndSelect('plan.routines', 'routine')
            .leftJoinAndSelect('routine.exercises', 'exercise')
            .where('plan.id = :id', { id: programPlanId })
            .orderBy('exercise.orderInRoutine', 'ASC')
            .getOne();
    }

    /**
     * Retrieves the complete workout program, including all associated routines,
     * exercises.
     * @param lineUserId The Line User ID of the trainee.
     * @returns The full WorkoutProgramEntity with eagerly loaded relations.
     */
    async findFullProgramByLineUserIdTrainee(lineUserId: string): Promise<WorkoutProgramEntity[]> {
        return this.createQueryBuilder('plan')
            .leftJoinAndSelect('plan.routines', 'routine')
            .leftJoinAndSelect('routine.exercises', 'exercise')
            .where('plan.lineUserIdTrainee = :lineUserIdTrainee', { lineUserIdTrainee: lineUserId })
            .orderBy('exercise.orderInRoutine', 'ASC')
            .getMany();
    }

    /**
     * Count the total number of distinct workout routines across all programs
     * assigned to a trainee. Used as the denominator for workout score.
     */
    async countRoutinesByTrainee(lineUserIdTrainee: string): Promise<number> {
        const result = await this.createQueryBuilder('plan')
            .innerJoin('plan.routines', 'routine')
            .select('COUNT(routine.id)', 'count')
            .where('plan.lineUserIdTrainee = :lineUserIdTrainee', { lineUserIdTrainee })
            .getRawOne<{ count: string }>();

        return parseInt(result?.count ?? '0', 10);
    }
}