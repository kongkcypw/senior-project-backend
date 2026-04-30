import { Injectable } from "@nestjs/common";
import { MessageEvent } from "@line/bot-sdk";
import { WorkoutProgramHandler } from "../workout-program.handler";
import { DialogflowIntentName } from "../../enums/dialogflow-intent-name";
import { NutritionPlanHandler } from "../nutrition-plan.handler";
import { TodayNutritionSummaryHandler } from "../today-nutrition-summary.handler";
import { HelpHandler } from "../help.handler";
import { LastWorkoutSessionHandler } from "../last-workout-session.handler";

@Injectable()
export class DialogflowWebhookPersonalChatHandler {
    constructor(
        private readonly workoutProgramHandler: WorkoutProgramHandler,
        private readonly nutritionPlanHandler: NutritionPlanHandler,
        private readonly todayNutritionSummaryHandler: TodayNutritionSummaryHandler,
        private readonly helpHandler: HelpHandler,
        private readonly lastWorkoutSessionHandler: LastWorkoutSessionHandler,
    ) { }

    async handleIntent(intentName: string, event: MessageEvent, fulfillmentMessages?: any[], parameters?: any): Promise<void> {
        console.log('Intent detected:', intentName);

        if (intentName === DialogflowIntentName.HELP) {
            return this.helpHandler.handlePersonalChat(event);
        }

        if (intentName === DialogflowIntentName.NUTRITION_PLAN) {
            return this.nutritionPlanHandler.handlePersonalChat(event);
        }

        if (intentName === DialogflowIntentName.TODAY_NUTRITION_SUMMARY) {
            return this.todayNutritionSummaryHandler.handlePersonalChat(event);
        }

        if (intentName === DialogflowIntentName.WORKOUT_PROGRAM) {
            return this.workoutProgramHandler.handlePersonalChat(event);
        }

        if (intentName === DialogflowIntentName.LAST_WORKOUT_SESSION) {
            return this.lastWorkoutSessionHandler.handlePersonalChat(event);
        }
    }
}