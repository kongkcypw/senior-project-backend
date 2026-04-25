import { Injectable } from "@nestjs/common";
import { IntentHandlerInterface } from "../interfaces/intent-handler.interface";
import { MessageEvent } from "@line/bot-sdk";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { LineGroupMemberService } from "src/line-group/services/line-group-member.service";
import { LineLiffNavigatePathService } from "src/external/line-liff/services/line-liff-navigate-path.service";
import { WorkoutProgramMessages } from "../messages/workout-program.message";

@Injectable()
export class WorkoutProgramHandler implements IntentHandlerInterface {
    constructor(
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
        private readonly lineGroupMemberService: LineGroupMemberService,
        private readonly lineLiffNavigatePathService: LineLiffNavigatePathService,
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

        // Inside your service method
        navigatePath = this.lineLiffNavigatePathService.getWorkoutProgramPage(trainee.lineUserId);

        // TODO: Implement fetch workout program data
        const mockRoutines = [
            {
                programName: "PPL Program",
                sessionName: "Push Day",
                exerciseCount: 6,
                isCompleted: true,
                navigateUrl: "mock",
            },
            {
                programName: "PPL Program",
                sessionName: "Pull Day",
                exerciseCount: 5,
                isCompleted: false,
                navigateUrl: navigatePath,
            },
        ];
        const payload = WorkoutProgramMessages(mockRoutines);

        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            payload
        );
    }

    async handlePersonalChat(event: MessageEvent): Promise<void> {
        // Implementation for personal chat handling
        const userId = event.source.userId;

        if (!userId) {
            return;
        }

        let navigatePath: string = "https://example.com/workout-program"; // Default URL or fetch based on userId

        // TODO: Implement fetch workout program data
        const mockRoutines = [
            {
                programName: "PPL Program",
                sessionName: "Push Day",
                exerciseCount: 6,
                isCompleted: true,
                navigateUrl: navigatePath,
            },
            {
                programName: "PPL Program",
                sessionName: "Pull Day",
                exerciseCount: 5,
                isCompleted: false,
                navigateUrl: navigatePath,
            },
        ];
        const payload = WorkoutProgramMessages(mockRoutines);

        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            payload
        );
    }
}