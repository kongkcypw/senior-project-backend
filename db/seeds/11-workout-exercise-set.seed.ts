import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { WorkoutExerciseSetEntity } from 'src/workout/entities/workout-exercise-set.entity';

type WorkoutExerciseSetSeed = Omit<WorkoutExerciseSetEntity, 'createdAt' | 'updatedAt' | 'workoutExercise'>;

let nextId = 1;
const id = () => nextId++;

const sets: WorkoutExerciseSetSeed[] = [
    // --- Exercise 1: Barbell Bench Press (routine 1 – Latif Push Day) ---
    { id: id(),  exerciseId: 1, set: 1, rep: 12, weightKg: 60 },
    { id: id(),  exerciseId: 1, set: 2, rep: 10, weightKg: 70 },
    { id: id(),  exerciseId: 1, set: 3, rep: 8,  weightKg: 80 },
    { id: id(),  exerciseId: 1, set: 4, rep: 6,  weightKg: 85 },

    // --- Exercise 2: Dumbbell Overhead Press (routine 1 – Latif Push Day) ---
    { id: id(),  exerciseId: 2, set: 1, rep: 12, weightKg: 20 },
    { id: id(),  exerciseId: 2, set: 2, rep: 10, weightKg: 22 },
    { id: id(),  exerciseId: 2, set: 3, rep: 8,  weightKg: 24 },

    // --- Exercise 3: Conventional Deadlift (routine 2 – Latif Pull Day) ---
    { id: id(),  exerciseId: 3, set: 1, rep: 5,  weightKg: 100 },
    { id: id(),  exerciseId: 3, set: 2, rep: 5,  weightKg: 110 },
    { id: id(), exerciseId: 3, set: 3, rep: 3,  weightKg: 120 },

    // --- Exercise 4: Barbell Squat (routine 3 – Latif Leg Day) ---
    { id: id(), exerciseId: 4, set: 1, rep: 12, weightKg: 60 },
    { id: id(), exerciseId: 4, set: 2, rep: 10, weightKg: 70 },
    { id: id(), exerciseId: 4, set: 3, rep: 8,  weightKg: 80 },
    { id: id(), exerciseId: 4, set: 4, rep: 6,  weightKg: 85 },

    // --- Exercise 5: Incline Bench Press (routine 4 – Arisa Push Day) ---
    { id: id(), exerciseId: 5, set: 1, rep: 12, weightKg: 40 },
    { id: id(), exerciseId: 5, set: 2, rep: 10, weightKg: 45 },
    { id: id(), exerciseId: 5, set: 3, rep: 8,  weightKg: 50 },

    // --- Exercise 6: Lat Pulldown (routine 5 – Arisa Pull Day) ---
    { id: id(), exerciseId: 6, set: 1, rep: 12, weightKg: 45 },
    { id: id(), exerciseId: 6, set: 2, rep: 10, weightKg: 50 },
    { id: id(), exerciseId: 6, set: 3, rep: 10, weightKg: 50 },

    // --- Exercise 7: Leg Press (routine 6 – Arisa Leg Day) ---
    { id: id(), exerciseId: 7, set: 1, rep: 15, weightKg: 80 },
    { id: id(), exerciseId: 7, set: 2, rep: 12, weightKg: 90 },
    { id: id(), exerciseId: 7, set: 3, rep: 10, weightKg: 100 },
    { id: id(), exerciseId: 7, set: 4, rep: 10, weightKg: 100 },

    // --- Exercise 8: Barbell Bench Press (routine 7 – Tawan Upper A) ---
    { id: id(), exerciseId: 8, set: 1, rep: 10, weightKg: 70 },
    { id: id(), exerciseId: 8, set: 2, rep: 8,  weightKg: 75 },
    { id: id(), exerciseId: 8, set: 3, rep: 6,  weightKg: 80 },

    // --- Exercise 9: Seated Overhead Press (routine 8 – Tawan Upper B) ---
    { id: id(), exerciseId: 9, set: 1, rep: 12, weightKg: 50 },
    { id: id(), exerciseId: 9, set: 2, rep: 10, weightKg: 55 },
    { id: id(), exerciseId: 9, set: 3, rep: 8,  weightKg: 60 },

    // --- Exercise 10: Goblet Squat (routine 11 – Nuch Full Body A) ---
    { id: id(), exerciseId: 10, set: 1, rep: 15, weightKg: 16 },
    { id: id(), exerciseId: 10, set: 2, rep: 12, weightKg: 20 },
    { id: id(), exerciseId: 10, set: 3, rep: 12, weightKg: 20 },
];

export default class MockWorkoutExerciseSetSeed implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(WorkoutExerciseSetEntity);
        await repository.query(
            `TRUNCATE "${repository.metadata.tableName}" RESTART IDENTITY CASCADE;`
        );
        await repository.save(sets);
    }
}
