export enum DialogflowIntentName {
    // ── Greeting ──
    GREETING = 'greeting',

    // ── Nutrition Intents ──
    CALORIES_IN_DAY = 'CaloriesInday', // Unused (duplicate of TodayNutritionSummary)
    NUTRITION_PLAN = 'NutritionPlan',
    TODAY_NUTRITION_SUMMARY = 'TodayNutritionSummary',
    MEAL_HISTORY = 'MealHistory',

    // ── Workout Intents ──
    WORKOUT_PROGRAM = 'WorkoutProgram',
    TODAY_WORKOUT_STATUS = 'TodayWorkoutStatus', // Unused (duplicate of TodayWorkoutSummary)
    WORKOUT_STREAK = 'WorkoutStreak',
    LAST_WORKOUT_SESSION = 'LastWorkoutSession',

    // ── Profile & Score Intents ──
    PHYSIQUE_INFO = 'PhysiqueInfo',
    MY_SCORE = 'MyScore',
    MY_TREND = 'MyTrend',

    // ── Utility Intents ──
    HELP = 'Help',
    COMPLEX_QUERY = 'ComplexQuery',
}