import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { IntentHandlerInterface } from "../interfaces/intent-handler.interface";
import { Injectable } from "@nestjs/common";
import { LineLiffNavigatePathService } from "src/external/line-liff/services/line-liff-navigate-path.service";
import { MessageEvent } from "@line/bot-sdk";
import { CaloriesInDayMessages } from "../messages/calories-in-day.message";
import { NutritionPlanService } from "src/nutrition/services/nutrition-plan.service";
import { MealHistoryService } from "src/nutrition/services/meal-history.service";
import { LineGroupMemberService } from "src/line-group/services/line-group-member.service";

@Injectable()
export class CaloriesInDayHandler implements IntentHandlerInterface {

    constructor(
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
        private readonly lineLiffNavigatePathService: LineLiffNavigatePathService,
        private readonly nutritionPlanService: NutritionPlanService,
        private readonly mealHistoryService: MealHistoryService,
        private readonly lineGroupMemberService: LineGroupMemberService,
    ) { }

    async handleGroupChat(event: MessageEvent): Promise<void> {

        const groupId = event.source.type === 'group' ? event.source.groupId : null;
        const userId = event.source.userId;
        let navigatePath: string;

        if (!userId) {
            return;
        }

        if (!groupId) {
            return;
        }

        const trainee = await this.lineGroupMemberService.findTraineeInGroup(groupId);

        if (!trainee) {
            return;
        }


        const nutritionPlan = await this.nutritionPlanService.getNutritionPlanByLineUserId(trainee.lineUserId);
        if (!nutritionPlan) {
            return;
        }

        const meals = await this.mealHistoryService.findMealsByDate(trainee.lineUserId, new Date());
        const totalCaloriesIntake = meals.reduce((total, meal) => total + meal.calories, 0);
        const remainingCalories = nutritionPlan.totalCalories - totalCaloriesIntake;
        const formatedDate = new Date().toLocaleString('th-TH', {
            timeZone: 'Asia/Bangkok',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
        });
        const displayName = trainee.displayName;

        navigatePath = this.lineLiffNavigatePathService.getCaloriesInDayPage(trainee.lineUserId);
        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            CaloriesInDayMessages(navigatePath, nutritionPlan.totalCalories, remainingCalories, formatedDate, displayName)
        );
    }

    async handlePersonalChat(event: MessageEvent): Promise<void> {}
}