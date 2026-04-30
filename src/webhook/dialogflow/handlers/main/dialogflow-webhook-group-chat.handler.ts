import { Injectable } from "@nestjs/common";
import { DialogflowIntentName } from "../../enums/dialogflow-intent-name";
import { MessageEvent } from "@line/bot-sdk";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { LineLiffNavigatePathService } from "src/external/line-liff/services/line-liff-navigate-path.service";
import { WorkoutProgramHandler } from "../workout-program.handler";
import { HelpHandler } from "../help.handler";
import { GreetingHandler } from "../greeting.handler";
import { LastWorkoutSessionHandler } from "../last-workout-session.handler";
import { PhysiqueInfoHandler } from "../physique-info.handler";
import { MyScoreHandler } from "../my-score.handler";

@Injectable()
export class DialogflowWebhookGroupChatHandler {
    constructor(
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
        private readonly lineLiffNavigatePathService: LineLiffNavigatePathService,
        private readonly workoutProgramHandler: WorkoutProgramHandler,
        private readonly helpHandler: HelpHandler,
        private readonly lastWorkoutSessionHandler: LastWorkoutSessionHandler,
        private readonly physiqueInfoHandler: PhysiqueInfoHandler,
        private readonly myScoreHandler: MyScoreHandler,
        private readonly greetingHandler: GreetingHandler,
    ) { }

    async handleIntent(intentName: string, event: MessageEvent, fulfillmentMessages?: any[], parameters?: any): Promise<void> {

        console.log('Intent detected:', intentName);

        if (intentName === DialogflowIntentName.GREETING) {
            return this.greetingHandler.handleGroupChat(event);
        }

        if (intentName === DialogflowIntentName.HELP) {
            return this.helpHandler.handleGroupChat(event);
        }

        if (intentName === DialogflowIntentName.WORKOUT_PROGRAM) {
            return this.workoutProgramHandler.handleGroupChat(event);
        }

        if (intentName === DialogflowIntentName.LAST_WORKOUT_SESSION) {
            return this.lastWorkoutSessionHandler.handleGroupChat(event);
        }

        if (intentName === DialogflowIntentName.PHYSIQUE_INFO) {
            return this.physiqueInfoHandler.handleGroupChat(event);
        }

        if (intentName === DialogflowIntentName.MY_SCORE) {
            return this.myScoreHandler.handleGroupChat(event, parameters);
        }

        return;
    }
}