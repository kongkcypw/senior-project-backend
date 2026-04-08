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