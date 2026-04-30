import { Injectable } from "@nestjs/common";
import { IntentHandlerInterface } from "../interfaces/intent-handler.interface";
import { MessageEvent, messagingApi } from "@line/bot-sdk";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { LineGroupMemberService } from "src/line-group/services/line-group-member.service";
import { LineLiffNavigatePathService } from "src/external/line-liff/services/line-liff-navigate-path.service";
import { WorkoutProgramMessages, WorkoutRoutineItem } from "../messages/workout-program.message";
import { WorkoutProgramService } from "src/workout/services/workout-program.service";
import { WorkoutHistoryService } from "src/workout/services/workout-history.service";
import { computeWorkoutScore } from "src/common/utils/score.util";

@Injectable()
export class WorkoutProgramHandler implements IntentHandlerInterface {
    constructor(
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
        private readonly lineGroupMemberService: LineGroupMemberService,
        private readonly lineLiffNavigatePathService: LineLiffNavigatePathService,
        private readonly workoutProgramService: WorkoutProgramService,
        private readonly workoutHistoryService: WorkoutHistoryService,
    ) { }

    private buildNoProgramMessage(workoutPlanUrl: string): messagingApi.Message[] {
        return [{
            type: "flex",
            altText: "ยังไม่มีโปรแกรมออกกำลังกาย",
            contents: {
                type: "bubble",
                body: {
                    type: "box",
                    layout: "vertical",
                    paddingAll: "16px",
                    contents: [
                        {
                            type: "text",
                            text: "ยังไม่ได้สร้างโปรแกรมออกกำลังกาย",
                            weight: "bold",
                            size: "lg",
                            wrap: true,
                            color: "#111111",
                        },
                        {
                            type: "text",
                            text: "คลิกปุ่มด้านล่างเพื่อสร้างโปรแกรมของคุณได้เลย",
                            size: "md",
                            color: "#555555",
                            wrap: true,
                            margin: "sm",
                        },
                    ],
                },
                footer: {
                    type: "box",
                    layout: "vertical",
                    paddingAll: "12px",
                    contents: [
                        {
                            type: "button",
                            style: "primary",
                            color: "#4270ED",
                            action: {
                                type: "uri",
                                label: "สร้างโปรแกรม",
                                uri: workoutPlanUrl,
                            },
                        },
                    ],
                },
            },
        }];
    }

    private async buildRoutineItems(lineUserId: string): Promise<{ items: WorkoutRoutineItem[]; workoutPlanUrl: string; workoutScore: number }> {
        const workoutPlanUrl = this.lineLiffNavigatePathService.getWorkoutPlanPage(lineUserId);
        const [programs, completedRoutineIds, sessionsLogged] = await Promise.all([
            this.workoutProgramService.getProgramPlanByLineUserIdTrainee(lineUserId),
            this.workoutHistoryService.getRoutinesDoneThisWeek(lineUserId),
            this.workoutHistoryService.getDistinctSessionDaysThisWeek(lineUserId),
        ]);
        const completedSet = new Set(completedRoutineIds);

        const items: WorkoutRoutineItem[] = [];
        for (const program of programs) {
            for (const routine of program.routines) {
                items.push({
                    programName: program.name,
                    sessionName: routine.name,
                    exerciseCount: routine.exercises.length,
                    isCompleted: completedSet.has(routine.id),
                    navigateUrl: this.lineLiffNavigatePathService.getRoutineDetailPage(lineUserId, routine.id.toString()),
                });
            }
        }
        const workoutScore = computeWorkoutScore(sessionsLogged, items.length);
        return { items, workoutPlanUrl, workoutScore };
    }

    async handleGroupChat(event: MessageEvent): Promise<void> {
        const groupId = event.source.type === 'group' ? event.source.groupId : null;
        const userId = event.source.userId;

        if (!userId || !groupId) return;

        const trainee = await this.lineGroupMemberService.findTraineeInGroup(groupId);
        if (!trainee) return;

        const { items, workoutPlanUrl, workoutScore } = await this.buildRoutineItems(trainee.lineUserId);

        if (items.length === 0) {
            await this.lineMessagingApiClientService.sendReplyMessages(
                event.replyToken,
                this.buildNoProgramMessage(workoutPlanUrl),
            );
            return;
        }

        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            WorkoutProgramMessages(items, workoutScore),
        );
    }

    async handlePersonalChat(event: MessageEvent): Promise<void> {
        const userId = event.source.userId;
        if (!userId) return;

        const { items, workoutPlanUrl, workoutScore } = await this.buildRoutineItems(userId);

        if (items.length === 0) {
            await this.lineMessagingApiClientService.sendReplyMessages(
                event.replyToken,
                this.buildNoProgramMessage(workoutPlanUrl),
            );
            return;
        }

        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            WorkoutProgramMessages(items, workoutScore),
        );
    }
}
