import { Injectable } from "@nestjs/common";
import { LineLiffConfigService } from "./config.service";
import { LINE_LIFF_BASE_URL } from "../constants/base-url.constant";
import { WebPath } from "../enums/web-path.enum";

@Injectable()
export class LineLiffNavigatePathService {

    private basePath: string = LINE_LIFF_BASE_URL;
    private liffId: string;

    constructor(
        private readonly lineLiffConfigService: LineLiffConfigService,
    ) {
        this.liffId = this.lineLiffConfigService.liffId;
    }

    get navigateProfilePage(): string {
        return `${this.basePath}/${this.liffId}/${WebPath.PROFILE}`;
    }

    getBodyInformationPage(userId: string): string {
        return `${this.basePath}/${this.liffId}/${WebPath.BODY_INFORMATION}/${userId}`;
    }

    getNutritionPlanPage(userId: string): string {
        return `${this.basePath}/${this.liffId}/${WebPath.NUTRITION_PLAN}/${userId}`;
    }

    getWorkoutPlanPage(userId: string): string {
        return `${this.basePath}/${this.liffId}/${WebPath.WORKOUT_PLAN}/${userId}`;
    }

    getNutritionInDayPage(userId: string): string {
        return `${this.basePath}/${this.liffId}/${WebPath.NUTRITION_IN_DAY}/${userId}`;
    }

    getMealDetailPage(userId: string, mealId: string): string {
        return `${this.basePath}/${this.liffId}/${WebPath.MEAL_DETAIL}/${userId}/${mealId}`;
    }

    getCreateRoutinePage(userId: string): string {
        return `${this.basePath}/${this.liffId}/${WebPath.CREATE_ROUTINE}/${userId}`;
    }

    getSelectExercisePage(userId: string): string {
        return `${this.basePath}/${this.liffId}/${WebPath.SELECT_EXERCISE}/${userId}`;
    }

    getRoutineDetailPage(userId: string, routineId: string): string {
        return `${this.basePath}/${this.liffId}/${WebPath.ROUTINE_DETAIL}/${userId}/${routineId}`;
    }

    getEditRoutinePage(userId: string, routineId: string): string {
        return `${this.basePath}/${this.liffId}/${WebPath.EDIT_ROUTINE}/${userId}/${routineId}`;
    }

    getLogSessionPage(userId: string, routineId: string): string {
        return `${this.basePath}/${this.liffId}/${WebPath.LOG_SESSION}/${userId}/${routineId}`;
    }
}
