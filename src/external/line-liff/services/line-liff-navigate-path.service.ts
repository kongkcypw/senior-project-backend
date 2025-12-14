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

    getManageNutritionProgramPage(userId: string): string {
        return `${this.basePath}/${this.liffId}/${WebPath.MANAGE_PLAN_NUTRITION}/${userId}`;
    }

    getManageWorkoutProgramPage(userId: string): string {
        return `${this.basePath}/${this.liffId}/${WebPath.MANAGE_PLAN_WORKOUT}/${userId}`;
    }

    getCaloriesInDayPage(userId: string): string {
        return `${this.basePath}/${this.liffId}/${WebPath.CALORIES_IN_DAY}/${userId}`;
    }

    // TODO: Add workout program page
    getWorkoutProgramPage(userId: string): string {
        return `${this.basePath}/${this.liffId}/${WebPath.MANAGE_PLAN_WORKOUT}/${userId}`;
    }
}