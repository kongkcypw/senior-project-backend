import { WorkoutDayDefinitionEntity } from "src/workout/entities/workout-day-definition.entity";
import { MockWorkoutProgramPlans } from "./08-workout-program-plan.seed";
import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";

type WorkoutDayDefinitionSeed = Omit<WorkoutDayDefinitionEntity, 'createdAt' | 'updatedAt' | 'workoutProgramPlan' | 'exerciseDetails' | 'historyLogs'>;

export class MockWorkoutDayDefinitions {
    static readonly DAY_PUSH_001: WorkoutDayDefinitionSeed = {
        id: 1,
        programPlanId: MockWorkoutProgramPlans.PPL_TEMPLATE_001.id,
        dayName: 'Push Day',
    };

    static readonly DAY_PULL_002: WorkoutDayDefinitionSeed = {
        id: 2,
        programPlanId: MockWorkoutProgramPlans.PPL_TEMPLATE_001.id,
        dayName: 'Pull Day',
    };

    static readonly DAY_LEGS_003: WorkoutDayDefinitionSeed = {
        id: 3,
        programPlanId: MockWorkoutProgramPlans.PPL_TEMPLATE_001.id,
        dayName: 'Leg Day',
    };

    static readonly WorkoutDayDefinitions = [
        this.DAY_PUSH_001,
        this.DAY_PULL_002,
        this.DAY_LEGS_003,
    ]
}

export default class MockWorkoutDayDefinitionSeed implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(WorkoutDayDefinitionEntity);
        await repository.query(
            `TRUNCATE "${repository.metadata.tableName}" RESTART IDENTITY CASCADE;`
        )
        await repository.save(MockWorkoutDayDefinitions.WorkoutDayDefinitions);
    }
}