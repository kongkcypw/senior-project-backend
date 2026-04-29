export const WorkoutProgramFactory = {
    create(override: Record<string, any> = {}) {
        return {
            id: 1,
            name: 'Test Program',
            lineUserIdTrainee: 'U_TRAINEE_001',
            lineUserIdTrainer: 'U_TRAINER_001',
            orderInWorkout: 1,
            routines: [],
            createdAt: new Date('2024-01-01'),
            ...override,
        };
    },
};

export const WorkoutRoutineFactory = {
    create(override: Record<string, any> = {}) {
        return {
            id: 1,
            name: 'Test Routine',
            programId: 1,
            orderInProgram: 1,
            exercises: [],
            ...override,
        };
    },
};

export const WorkoutHistoryFactory = {
    createSession(override: Record<string, any> = {}) {
        return {
            id: 1,
            lineUserId: 'U_TRAINEE_001',
            routineId: 1,
            startedAt: new Date('2024-01-01T10:00:00'),
            finishedAt: null,
            exerciseLogs: [],
            ...override,
        };
    },
};

export const WorkoutExerciseTemplateFactory = {
    create(override: Record<string, any> = {}) {
        return {
            id: 1,
            name: 'Push Up',
            imageUrl: null,
            sets: [],
            isTemplate: true,
            ...override,
        };
    },
};
