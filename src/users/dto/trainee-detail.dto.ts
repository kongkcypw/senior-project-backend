import type { Trend } from 'src/common/utils/score.util';

export class TraineeDetailDto {
    id: number;
    lineUserId: string;
    displayName: string | null;
    pictureUrl: string | null;
    role: string | null;
    joinDate: string;

    /** Today's nutrition — calories/macros consumed vs daily target. */
    calories: {
        consumed: number;
        goal: number;
    };
    macros: {
        protein: number;
        carbs: number;
        fat: number;
    };
    macroTargets: {
        protein: number;
        carbs: number;
        fat: number;
    };

    /** This week's workout — sessions completed vs total routines in program. */
    weekWorkout: {
        completed: number;
        total: number;
    };

    /** Per-period scores (same as TraineeWithProgressDto). */
    scores: {
        daily: { workout: number; nutrition: number; total: number };
        weekly: { workout: number; nutrition: number; total: number };
        monthly: { workout: number; nutrition: number; total: number };
    };

    trend: Trend;
}
