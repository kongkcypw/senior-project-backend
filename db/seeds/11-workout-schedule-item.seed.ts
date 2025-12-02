import { WorkoutScheduleItemEntity } from "src/workout/entities/workout-schedule-item.entity";
import { MockWorkoutProgramPlans } from "./08-workout-program-plan.seed";
import { MockWorkoutDayDefinitions } from "./09-workout-day-definition.seed";
import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";

type WorkoutScheduleItemSeed = Omit<WorkoutScheduleItemEntity, 'createdAt' | 'updatedAt' | 'workoutProgramPlan' | 'workoutDayDefinition'>;

export class MockWorkoutScheduleItems {
    static readonly SCHEDULE_PUSH: WorkoutScheduleItemSeed = {
        id: 1,
        programPlanId: MockWorkoutProgramPlans.PPL_TEMPLATE_001.id,
        workoutDayDefinitionId: MockWorkoutDayDefinitions.DAY_PUSH_001.id,
        scheduleType: 'WEEKLY',
        frequency: 1,
        intervalValue: null,
        dayOfWeek: 1, // Monday
        preferredTime: '18:00',
    };

    static readonly SCHEDULE_PULL: WorkoutScheduleItemSeed = {
        id: 2,
        programPlanId: MockWorkoutProgramPlans.PPL_TEMPLATE_001.id,
        workoutDayDefinitionId: MockWorkoutDayDefinitions.DAY_PULL_002.id,
        scheduleType: 'WEEKLY',
        frequency: 1,
        intervalValue: null,
        dayOfWeek: 3, // Wednesday
        preferredTime: '18:00',
    };

    static readonly SCHEDULE_LEGS: WorkoutScheduleItemSeed = {
        id: 3,
        programPlanId: MockWorkoutProgramPlans.PPL_TEMPLATE_001.id,
        workoutDayDefinitionId: MockWorkoutDayDefinitions.DAY_LEGS_003.id,
        scheduleType: 'WEEKLY',
        frequency: 1,
        intervalValue: null,
        dayOfWeek: 5, // Friday
        preferredTime: '18:00',
    };

    static readonly WorkoutScheduleItems = [
        this.SCHEDULE_PUSH,
        this.SCHEDULE_PULL,
        this.SCHEDULE_LEGS,
    ]
}

export default class MockWorkoutScheduleItemSeed implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(WorkoutScheduleItemEntity);
        await repository.query(
            `TRUNCATE "${repository.metadata.tableName}" RESTART IDENTITY CASCADE;`
        )
        await repository.save(MockWorkoutScheduleItems.WorkoutScheduleItems);
    }
}