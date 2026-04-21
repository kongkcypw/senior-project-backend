import { Injectable } from "@nestjs/common";
import { UserRelationshipsRepository } from "../repositories/user-relationships.repository";
import { LineGroupMemberService } from "src/line-group/services/line-group-member.service";
import { UserRepository } from "../repositories/user.repository";
import { UserInfoDto } from "../dto/user-info.dto";
import { plainToInstance } from "class-transformer";
import { WorkoutHistoryRepository } from "src/workout/repositories/workout-history.repository";
import { WorkoutProgramPlanRepository } from "src/workout/repositories/workout-program.repository";
import { MealHistoryRepository } from "src/nutrition/repositories/meal-history.repository";
import { NutritionPlanRepository } from "src/nutrition/repositories/nutrition-plan.repository";
import {
    computeWorkoutScore,
    computeNutritionScore,
    computeTotalScore,
    computeTrend,
    dailyWindow,
    weeklyWindow,
    lastWeeklyWindow,
    monthlyWindow,
    buildHistoryBuckets,
    type DateWindow,
    type HistoryPeriod,
} from "src/common/utils/score.util";
import {
    TraineeWithProgressDto,
    PeriodScoreDto,
    WorkoutWindowDto,
    NutritionWindowDto,
} from "../dto/trainee-with-progress.dto";
import { ScoreHistoryDto, ScoreHistoryPointDto } from "../dto/score-history.dto";
import { HomeStatsDto } from "../dto/home-stats.dto";
import { TraineeDetailDto } from "../dto/trainee-detail.dto";
import { UserEntity } from "../entities/user.entity";
import { NutritionPlanEntity } from "src/nutrition/entities/nutrition-plan.entity";

@Injectable()
export class UserRelationshipsService {
    constructor(
        private readonly userRelationshipsRepository: UserRelationshipsRepository,
        private readonly lineGroupMemberService: LineGroupMemberService,
        private readonly userRepository: UserRepository,
        private readonly workoutHistoryRepository: WorkoutHistoryRepository,
        private readonly workoutProgramRepository: WorkoutProgramPlanRepository,
        private readonly mealHistoryRepository: MealHistoryRepository,
        private readonly nutritionPlanRepository: NutritionPlanRepository,
    ) { }

    async isAssignedTrainerForTrainee(trainerLineUserId: string, traineeLineUserId: string): Promise<boolean> {
        const relationship = await this.userRelationshipsRepository.findActiveRelationshipsByTraineeAndTrainer(trainerLineUserId, traineeLineUserId);

        if (!relationship) {
            return false;
        }

        return true;
    }

    async insertTrainerRelationshipIfNotExist(groupId: string, traineeLineUserId: string): Promise<void> {

        const trainer = await this.lineGroupMemberService.findTrainerInGroup(groupId);
        if (!trainer) {
            throw new Error(`No trainer found in group ${groupId}`);
        }

        const existingRelationship = await this.userRelationshipsRepository.findActiveRelationshipsByTraineeAndTrainer(
            traineeLineUserId,
            trainer.lineUserId
        );

        if (existingRelationship) {
            return;
        }

        const newRelationship = this.userRelationshipsRepository.create({
            trainerLineUserId: trainer.lineUserId,
            traineeLineUserId,
        });

        await this.userRelationshipsRepository.save(newRelationship);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /** Build one PeriodScoreDto for a trainee and a time window. */
    private async buildPeriodScore(
        lineUserId: string,
        window: DateWindow,
        windowDays: number,
        totalRoutines: number,
        nutritionPlan: NutritionPlanEntity | null,
    ): Promise<PeriodScoreDto> {
        const [sessionsLogged, macros] = await Promise.all([
            this.workoutHistoryRepository.countDistinctSessionDays(lineUserId, window.from, window.to),
            this.mealHistoryRepository.sumMacrosInWindow(lineUserId, window.from, window.to),
        ]);

        const wScore = computeWorkoutScore(sessionsLogged, totalRoutines);
        const nScore = computeNutritionScore(macros, nutritionPlan, windowDays);
        const total  = computeTotalScore(wScore, nScore);

        const workout: WorkoutWindowDto = {
            sessionsLogged,
            totalRoutines,
            score: Math.round(wScore),
        };

        const nutrition: NutritionWindowDto = {
            calories:          macros.calories,
            protein:           macros.protein,
            carbohydrate:      macros.carbohydrate,
            fat:               macros.fat,
            targetCalories:    (nutritionPlan?.totalCalories ?? 0) * windowDays,
            targetProtein:     (nutritionPlan?.protein       ?? 0) * windowDays,
            targetCarbohydrate:(nutritionPlan?.carbohydrate  ?? 0) * windowDays,
            targetFat:         (nutritionPlan?.fat           ?? 0) * windowDays,
            score:             Math.round(nScore),
        };

        return { workout, nutrition, total };
    }

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------

    async findAllTraineeByTrainerLineUserId(
        trainerLineUserId: string,
    ): Promise<TraineeWithProgressDto[]> {
        const relationships = await this.userRelationshipsRepository.findAllActiveRelationshipsByTrainer(trainerLineUserId);

        if (!relationships || relationships.length === 0) {
            return [];
        }

        const traineeLineUserIds = relationships.map(r => r.traineeLineUserId);
        const trainees = await this.userRepository.findByLineUserIds(traineeLineUserIds);

        // Build a map of relationship data (joinDate) keyed by lineUserId
        const relMap = new Map(relationships.map(r => [r.traineeLineUserId, r]));

        // Pre-fetch date windows (same for all trainees)
        const daily      = dailyWindow();
        const weekly     = weeklyWindow();
        const lastWeekly = lastWeeklyWindow();
        const monthly    = monthlyWindow();

        const results = await Promise.all(
            trainees.map(async (trainee: UserEntity): Promise<TraineeWithProgressDto> => {
                const lid = trainee.lineUserId;

                // Parallelise per-trainee lookups
                const [totalRoutines, nutritionPlan] = await Promise.all([
                    this.workoutProgramRepository.countRoutinesByTrainee(lid),
                    this.nutritionPlanRepository.findByLineUserId(lid),
                ]);

                // Build all period scores in parallel
                const [dailyScore, weeklyScore, monthlyScore, lastWeekScore] = await Promise.all([
                    this.buildPeriodScore(lid, daily,      1,  totalRoutines, nutritionPlan),
                    this.buildPeriodScore(lid, weekly,     7,  totalRoutines, nutritionPlan),
                    this.buildPeriodScore(lid, monthly,    30, totalRoutines, nutritionPlan),
                    this.buildPeriodScore(lid, lastWeekly, 7,  totalRoutines, nutritionPlan),
                ]);

                const trend = computeTrend(weeklyScore.total, lastWeekScore.total);

                const rel = relMap.get(lid);
                const joinDate = rel?.assignedAt
                    ? rel.assignedAt.toISOString().split('T')[0]
                    : '';

                const dto = new TraineeWithProgressDto();
                dto.id          = trainee.id;
                dto.lineUserId  = trainee.lineUserId;
                dto.displayName = trainee.displayName;
                dto.pictureUrl  = trainee.pictureUrl;
                dto.role        = trainee.role;
                dto.joinDate    = joinDate;
                dto.daily       = dailyScore;
                dto.weekly      = weeklyScore;
                dto.monthly     = monthlyScore;
                dto.trend       = trend;

                return dto;
            })
        );

        return results;
    }

    // -------------------------------------------------------------------------
    // Home stats (timeline-based nutrition status + weekly workout completion)
    // -------------------------------------------------------------------------

    /**
     * Returns the stat counts shown on the trainer home page.
     *
     * Nutrition (today, timeline-based):
     *   - completed: all notification-time slots for today have a logged meal
     *   - onTrack:   all slots whose send-time has already passed have a logged meal,
     *                and the next upcoming slot hasn't been reached yet
     *   - late:      at least one slot is overdue by more than 30 minutes without a
     *                matching meal log
     *   Trainees without a nutrition plan or without any notification times are
     *   excluded from the nutrition total entirely — their status can't be
     *   determined, so counting them as late would misrepresent the trainer's
     *   actual situation.
     *
     * Workout (this week):
     *   - completed:  distinct session days this week >= total routines in program
     *   - incomplete: otherwise
     *   Trainees without any routines assigned are counted as incomplete.
     */
    async getHomeStatsForTrainer(trainerLineUserId: string): Promise<HomeStatsDto> {
        const relationships = await this.userRelationshipsRepository.findAllActiveRelationshipsByTrainer(trainerLineUserId);

        if (!relationships || relationships.length === 0) {
            return {
                nutrition: { total: 0, completed: 0, onTrack: 0, late: 0 },
                workout:   { total: 0, completed: 0, incomplete: 0 },
            };
        }

        const traineeLineUserIds = relationships.map(r => r.traineeLineUserId);
        const daily  = dailyWindow();
        const weekly = weeklyWindow();

        const LATE_THRESHOLD_MS = 30 * 60 * 1000;
        const now = new Date();

        // Build "HH:MM:SS of today" helper to compare against notification.sendAt (time type)
        const parseSlotTimeToday = (sendAt: string): Date => {
            // sendAt is "HH:MM:SS" — anchor to the start-of-day from `daily.from`
            const [h, m, s] = sendAt.split(':').map((v) => parseInt(v, 10));
            const slot = new Date(daily.from);
            slot.setHours(h || 0, m || 0, s || 0, 0);
            return slot;
        };

        // Fetch everything in parallel per trainee
        const perTrainee = await Promise.all(traineeLineUserIds.map(async (lid) => {
            const [nutritionPlan, mealsToday, workoutDaysThisWeek, totalRoutines] = await Promise.all([
                this.nutritionPlanRepository.findByLineUserId(lid),
                this.mealHistoryRepository.countMealsInWindow(lid, daily.from, daily.to),
                this.workoutHistoryRepository.countDistinctSessionDays(lid, weekly.from, weekly.to),
                this.workoutProgramRepository.countRoutinesByTrainee(lid),
            ]);
            return { lid, nutritionPlan, mealsToday, workoutDaysThisWeek, totalRoutines };
        }));

        let nCompleted = 0, nOnTrack = 0, nLate = 0, nTotal = 0;
        let wCompleted = 0, wIncomplete = 0;

        for (const t of perTrainee) {
            // ---- Nutrition classification ----
            const slots = t.nutritionPlan?.notificationTimes ?? [];
            if (t.nutritionPlan && slots.length > 0) {
                nTotal += 1;

                const slotTimes = slots
                    .map((s) => parseSlotTimeToday(s.sendAt))
                    .sort((a, b) => a.getTime() - b.getTime());

                const totalSlots    = slotTimes.length;
                const passedSlots   = slotTimes.filter((s) => s.getTime() <= now.getTime()).length;
                const overdueSlots  = slotTimes.filter((s) => now.getTime() - s.getTime() >= LATE_THRESHOLD_MS).length;

                if (t.mealsToday >= totalSlots) {
                    nCompleted += 1;
                } else if (t.mealsToday >= passedSlots) {
                    // Caught up on everything due so far; waiting on upcoming slot.
                    nOnTrack += 1;
                } else if (t.mealsToday >= overdueSlots) {
                    // Slot just became due (within 30-min grace window). Still on-track.
                    nOnTrack += 1;
                } else {
                    nLate += 1;
                }
            }
            // Trainees without a plan or without notification times are excluded
            // from the nutrition total entirely.

            // ---- Workout classification ----
            if (t.totalRoutines > 0 && t.workoutDaysThisWeek >= t.totalRoutines) {
                wCompleted += 1;
            } else {
                wIncomplete += 1;
            }
        }

        const wTotal = perTrainee.length;
        return {
            nutrition: { total: nTotal, completed: nCompleted, onTrack: nOnTrack, late: nLate },
            workout:   { total: wTotal, completed: wCompleted, incomplete: wIncomplete },
        };
    }

    // -------------------------------------------------------------------------
    // Trainee detail (full profile: nutrition + workout + scores)
    // -------------------------------------------------------------------------

    /**
     * Returns the full trainee profile with today's nutrition detail and
     * this week's workout completion status.
     */
    async getTraineeDetailByLineUserId(lineUserId: string): Promise<TraineeDetailDto> {
        const trainee = await this.userRepository.findOne({ where: { lineUserId } });
        if (!trainee) {
            throw new Error(`Trainee with lineUserId ${lineUserId} not found`);
        }

        const daily = dailyWindow();
        const weekly = weeklyWindow();
        const monthly = monthlyWindow();

        // Fetch all necessary data
        const [totalRoutines, nutritionPlan] = await Promise.all([
            this.workoutProgramRepository.countRoutinesByTrainee(trainee.lineUserId),
            this.nutritionPlanRepository.findByLineUserId(trainee.lineUserId),
        ]);

        const [workoutDaysDaily, workoutDaysWeekly, workoutDaysMonthly, macrosToday, macrosWeekly, macrosMonthly] =
            await Promise.all([
                this.workoutHistoryRepository.countDistinctSessionDays(trainee.lineUserId, daily.from, daily.to),
                this.workoutHistoryRepository.countDistinctSessionDays(trainee.lineUserId, weekly.from, weekly.to),
                this.workoutHistoryRepository.countDistinctSessionDays(trainee.lineUserId, monthly.from, monthly.to),
                this.mealHistoryRepository.sumMacrosInWindow(trainee.lineUserId, daily.from, daily.to),
                this.mealHistoryRepository.sumMacrosInWindow(trainee.lineUserId, weekly.from, weekly.to),
                this.mealHistoryRepository.sumMacrosInWindow(trainee.lineUserId, monthly.from, monthly.to),
            ]);

        const dailyWorkout   = computeWorkoutScore(workoutDaysDaily, totalRoutines);
        const dailyNutrition = computeNutritionScore(macrosToday, nutritionPlan, 1);
        const dailyTotal     = computeTotalScore(dailyWorkout, dailyNutrition);

        const weeklyWorkout   = computeWorkoutScore(workoutDaysWeekly, totalRoutines);
        const weeklyNutrition = computeNutritionScore(macrosWeekly, nutritionPlan, 7);
        const weeklyTotal     = computeTotalScore(weeklyWorkout, weeklyNutrition);

        const monthlyWorkout   = computeWorkoutScore(workoutDaysMonthly, totalRoutines);
        const monthlyNutrition = computeNutritionScore(macrosMonthly, nutritionPlan, 30);
        const monthlyTotal     = computeTotalScore(monthlyWorkout, monthlyNutrition);

        // Compute last week's score for trend
        const lastWeekly = lastWeeklyWindow();
        const lastWeekWorkoutDays = await this.workoutHistoryRepository.countDistinctSessionDays(
            trainee.lineUserId,
            lastWeekly.from,
            lastWeekly.to,
        );
        const lastWeekWorkoutScore = computeWorkoutScore(lastWeekWorkoutDays, totalRoutines);
        const lastWeekMacros = await this.mealHistoryRepository.sumMacrosInWindow(
            trainee.lineUserId,
            lastWeekly.from,
            lastWeekly.to,
        );
        const lastWeekNutritionScore = computeNutritionScore(lastWeekMacros, nutritionPlan, 7);
        const lastWeeklyTotal = computeTotalScore(lastWeekWorkoutScore, lastWeekNutritionScore);

        const trend = computeTrend(weeklyTotal, lastWeeklyTotal);

        return {
            id: trainee.id,
            lineUserId: trainee.lineUserId,
            displayName: trainee.displayName,
            pictureUrl: trainee.pictureUrl ?? null,
            role: trainee.role,
            joinDate: trainee.createdAt ? trainee.createdAt.toISOString().split('T')[0] : '—',
            calories: {
                consumed: Math.round(macrosToday.calories),
                goal: nutritionPlan?.totalCalories ?? 0,
            },
            macros: {
                protein: Math.round(macrosToday.protein),
                carbs: Math.round(macrosToday.carbohydrate),
                fat: Math.round(macrosToday.fat),
            },
            macroTargets: {
                protein: nutritionPlan?.protein ?? 0,
                carbs: nutritionPlan?.carbohydrate ?? 0,
                fat: nutritionPlan?.fat ?? 0,
            },
            weekWorkout: {
                completed: Math.min(workoutDaysWeekly, totalRoutines),
                total: totalRoutines,
            },
            scores: {
                daily: { workout: dailyWorkout, nutrition: dailyNutrition, total: dailyTotal },
                weekly: { workout: weeklyWorkout, nutrition: weeklyNutrition, total: weeklyTotal },
                monthly: { workout: monthlyWorkout, nutrition: monthlyNutrition, total: monthlyTotal },
            },
            trend,
        };
    }


    // -------------------------------------------------------------------------
    // Trainees summary (lightweight — no score computation)
    // -------------------------------------------------------------------------

    async findTraineesSummaryByTrainer(trainerLineUserId: string): Promise<{
        count: number;
        trainees: { lineUserId: string; displayName: string | null; pictureUrl: string | null }[];
    }> {
        const relationships = await this.userRelationshipsRepository.findAllActiveRelationshipsByTrainer(trainerLineUserId);

        if (!relationships || relationships.length === 0) {
            return { count: 0, trainees: [] };
        }

        const traineeLineUserIds = relationships.map(r => r.traineeLineUserId);
        const users = await this.userRepository.findByLineUserIds(traineeLineUserIds);

        return {
            count: users.length,
            trainees: users.map(u => ({
                lineUserId:  u.lineUserId,
                displayName: u.displayName,
                pictureUrl:  u.pictureUrl,
            })),
        };
    }

    // -------------------------------------------------------------------------
    // Score history (trainer-wide average time series)
    // -------------------------------------------------------------------------

    /**
     * Returns the trainer-wide average total score over time, bucketed by the
     * given period:
     *  - daily   → 7 points, Mon–Sun of this week
     *  - weekly  → ISO weeks that overlap the current month
     *  - monthly → 12 points, Jan–Dec of this year
     *
     * Future buckets return `avg = null` (chart shows a gap).
     *
     * Implementation: for each trainee we run exactly **two** grouped SQL
     * queries (workout-days per bucket, meal-macros per bucket), then combine
     * the results in memory and average across trainees.
     */
    async getScoreHistoryForTrainee(
        traineeLineUserId: string,
        period: HistoryPeriod,
    ): Promise<ScoreHistoryDto> {
        const { truncUnit, rangeFrom, rangeTo, buckets } = buildHistoryBuckets(period);

        const [totalRoutines, nutritionPlan, workoutDaysMap, macrosMap] = await Promise.all([
            this.workoutProgramRepository.countRoutinesByTrainee(traineeLineUserId),
            this.nutritionPlanRepository.findByLineUserId(traineeLineUserId),
            this.workoutHistoryRepository.countDaysGroupedByBucket(traineeLineUserId, rangeFrom, rangeTo, truncUnit),
            this.mealHistoryRepository.sumMacrosGroupedByBucket(traineeLineUserId, rangeFrom, rangeTo, truncUnit),
        ]);

        const points: ScoreHistoryPointDto[] = buckets.map((bucket) => {
            if (bucket.isFuture) return { label: bucket.label, avg: null };

            const bucketKey = bucket.from.toISOString();
            const daysLogged = workoutDaysMap.get(bucketKey) ?? 0;
            const macros = macrosMap.get(bucketKey) ?? { calories: 0, protein: 0, carbohydrate: 0, fat: 0 };

            const wScore = computeWorkoutScore(daysLogged, totalRoutines);
            const nScore = computeNutritionScore(macros, nutritionPlan, bucket.windowDays);
            return { label: bucket.label, avg: computeTotalScore(wScore, nScore) };
        });

        return { period, points };
    }

    async getScoreHistoryForTrainer(
        trainerLineUserId: string,
        period: HistoryPeriod,
    ): Promise<ScoreHistoryDto> {
        const { truncUnit, rangeFrom, rangeTo, buckets } = buildHistoryBuckets(period);

        const relationships = await this.userRelationshipsRepository.findAllActiveRelationshipsByTrainer(trainerLineUserId);

        if (!relationships || relationships.length === 0) {
            return {
                period,
                points: buckets.map(b => ({ label: b.label, avg: b.isFuture ? null : 0 })),
            };
        }

        const traineeLineUserIds = relationships.map(r => r.traineeLineUserId);

        // Per-trainee static data (program size + nutrition plan), fetched once.
        const perTraineeStatic = await Promise.all(
            traineeLineUserIds.map(async (lid) => {
                const [totalRoutines, nutritionPlan] = await Promise.all([
                    this.workoutProgramRepository.countRoutinesByTrainee(lid),
                    this.nutritionPlanRepository.findByLineUserId(lid),
                ]);
                return { lineUserId: lid, totalRoutines, nutritionPlan };
            })
        );

        // Per-trainee grouped data: one workout query + one meal query each.
        const perTraineeGrouped = await Promise.all(
            traineeLineUserIds.map(async (lid) => {
                const [workoutDaysMap, macrosMap] = await Promise.all([
                    this.workoutHistoryRepository.countDaysGroupedByBucket(lid, rangeFrom, rangeTo, truncUnit),
                    this.mealHistoryRepository.sumMacrosGroupedByBucket(lid, rangeFrom, rangeTo, truncUnit),
                ]);
                return { lineUserId: lid, workoutDaysMap, macrosMap };
            })
        );

        // Index static data by lineUserId for quick lookup.
        const staticByUser = new Map(perTraineeStatic.map(s => [s.lineUserId, s]));

        // For each bucket, compute each trainee's total score then average them.
        const points: ScoreHistoryPointDto[] = buckets.map((bucket) => {
            if (bucket.isFuture) {
                return { label: bucket.label, avg: null };
            }

            const bucketKey = bucket.from.toISOString();
            let sum = 0;
            let count = 0;

            for (const grouped of perTraineeGrouped) {
                const stat = staticByUser.get(grouped.lineUserId);
                if (!stat) continue;

                const daysLogged = grouped.workoutDaysMap.get(bucketKey) ?? 0;
                const macros = grouped.macrosMap.get(bucketKey) ?? {
                    calories: 0, protein: 0, carbohydrate: 0, fat: 0,
                };

                const wScore = computeWorkoutScore(daysLogged, stat.totalRoutines);
                const nScore = computeNutritionScore(macros, stat.nutritionPlan, bucket.windowDays);
                const total  = computeTotalScore(wScore, nScore);

                sum   += total;
                count += 1;
            }

            const avg = count > 0 ? Math.round(sum / count) : 0;
            return { label: bucket.label, avg };
        });

        return { period, points };
    }
}