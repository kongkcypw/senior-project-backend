import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";
import { WorkoutRoutineTemplateEntity } from "src/workout/entities/workout-routine-template.entity";

type WorkoutRoutineTemplateSeed = Omit<WorkoutRoutineTemplateEntity, 'createdAt' | 'updatedAt' | 'exerciseTemplates'>;

export class MockWorkoutRoutineTemplates {

    // --- Templates for a classic PPL split ---

    static readonly TEMPLATE_PUSH_001: WorkoutRoutineTemplateSeed = {
        id: 1,
        name: 'PPL - Push (Chest, Shoulders, Tris)',
        description: 'Focuses on pushing movements for chest, shoulders, and triceps. High volume for hypertrophy.',
        tag: 'Hypertrophy, Upper Body, Push',
        imageUrl: 'http://example.com/images/template_push.jpg',
    };

    static readonly TEMPLATE_PULL_002: WorkoutRoutineTemplateSeed = {
        id: 2,
        name: 'PPL - Pull (Back, Biceps)',
        description: 'Focuses on pulling movements for back and biceps. Includes a heavy deadlift variation.',
        tag: 'Strength, Upper Body, Pull',
        imageUrl: 'http://example.com/images/template_pull.jpg',
    };

    static readonly TEMPLATE_LEGS_003: WorkoutRoutineTemplateSeed = {
        id: 3,
        name: 'PPL - Legs',
        description: 'Focuses on major lower body lifts: squats, hips, and calves.',
        tag: 'Strength, Lower Body, Legs',
        imageUrl: 'http://example.com/images/template_legs.jpg',
    };

    static readonly WorkoutRoutineTemplates = [
        this.TEMPLATE_PUSH_001,
        this.TEMPLATE_PULL_002,
        this.TEMPLATE_LEGS_003,
    ]
}

export default class MockWorkoutRoutineTemplateSeed implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(WorkoutRoutineTemplateEntity);
        // Using `query` for TRUNCATE is safe and necessary to reset SERIAL IDs
        await repository.query(
            `TRUNCATE "${repository.metadata.tableName}" RESTART IDENTITY CASCADE;`
        )
        await repository.save(MockWorkoutRoutineTemplates.WorkoutRoutineTemplates);
    }
}