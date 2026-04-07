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
    type DateWindow,
} from "src/common/utils/score.util";
import {
    TraineeWithProgressDto,
    PeriodScoreDto,
    WorkoutWindowDto,
    NutritionWindowDto,
} from "../dto/trainee-with-progress.dto";
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
}