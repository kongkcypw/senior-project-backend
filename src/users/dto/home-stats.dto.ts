export class NutritionStatusCountsDto {
    /** Total trainees assigned to this trainer. */
    total: number;
    /** Trainees who have logged a meal for every past notification-time slot today. */
    completed: number;
    /** Trainees who are on track (all past-slot meals logged, next meal not yet due). */
    onTrack: number;
    /** Trainees with at least one overdue slot that has no meal logged (>30 min late). */
    late: number;
}

export class WorkoutStatusCountsDto {
    /** Total trainees assigned to this trainer. */
    total: number;
    /** Trainees who have completed all routines in their program this week. */
    completed: number;
    /** Trainees who have not completed all routines in their program this week. */
    incomplete: number;
}

export class HomeStatsDto {
    nutrition: NutritionStatusCountsDto;
    workout: WorkoutStatusCountsDto;
}
