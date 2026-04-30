import { Injectable } from "@nestjs/common";
import { MessageEvent } from "@line/bot-sdk";
import { IntentHandlerInterface } from "../interfaces/intent-handler.interface";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { LineGroupMemberService } from "src/line-group/services/line-group-member.service";
import { LineLiffNavigatePathService } from "src/external/line-liff/services/line-liff-navigate-path.service";
import { WorkoutProgramService } from "src/workout/services/workout-program.service";
import { WorkoutHistoryService } from "src/workout/services/workout-history.service";
import { LastWorkoutSessionMessages } from "../messages/last-workout-session.message";

@Injectable()
export class LastWorkoutSessionHandler implements IntentHandlerInterface {
    constructor(
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
        private readonly lineGroupMemberService: LineGroupMemberService,
        private readonly lineLiffNavigatePathService: LineLiffNavigatePathService,
        private readonly workoutProgramService: WorkoutProgramService,
        private readonly workoutHistoryService: WorkoutHistoryService,
    ) { }

    private formatThaiDate(date: Date): string {
        return date.toLocaleDateString("th-TH", {
            timeZone: "Asia/Bangkok",
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    private async buildPayload(lineUserId: string) {
        const workoutPlanUrl = this.lineLiffNavigatePathService.getWorkoutPlanPage(lineUserId);

        const [programs, completedRoutineIds, latestSession] = await Promise.all([
            this.workoutProgramService.getProgramPlanByLineUserIdTrainee(lineUserId),
            this.workoutHistoryService.getRoutinesDoneThisWeek(lineUserId),
            this.workoutHistoryService.getLatestCompletedSessionSummary(lineUserId),
        ]);

        if (!latestSession) {
            return LastWorkoutSessionMessages(null, workoutPlanUrl);
        }

        const totalRoutines = programs.reduce((sum, program) => sum + program.routines.length, 0);
        const completedSessionsThisWeek = completedRoutineIds.length;

        const routineInPlan = programs
            .flatMap((program) =>
                program.routines.map((routine) => ({
                    routine,
                    programName: program.name,
                })),
            )
            .find((item) => item.routine.id === latestSession.routineId);

        const sessionName = routineInPlan?.routine.name ?? latestSession.routineName;
        const programName = routineInPlan?.programName ?? latestSession.programName;
        const exerciseCount = routineInPlan?.routine.exercises.length ?? 0;

        const sessionDetailUrl = this.lineLiffNavigatePathService.getRoutineDetailPage(
            lineUserId,
            latestSession.routineId.toString(),
        );

        return LastWorkoutSessionMessages(
            {
                programName,
                sessionName,
                exerciseCount,
                sessionDateText: this.formatThaiDate(latestSession.startedAt),
                completedSessionsThisWeek,
                totalRoutines,
                navigateUrl: sessionDetailUrl,
            },
            workoutPlanUrl,
        );
    }

    async handleGroupChat(event: MessageEvent): Promise<void> {
        const groupId = event.source.type === "group" ? event.source.groupId : null;
        const userId = event.source.userId;

        if (!userId || !groupId) return;

        const trainee = await this.lineGroupMemberService.findTraineeInGroup(groupId);
        if (!trainee) return;

        const payload = await this.buildPayload(trainee.lineUserId);
        await this.lineMessagingApiClientService.sendReplyMessages(event.replyToken, payload);
    }

    async handlePersonalChat(event: MessageEvent): Promise<void> {
        const userId = event.source.userId;
        if (!userId) return;

        const payload = await this.buildPayload(userId);
        await this.lineMessagingApiClientService.sendReplyMessages(event.replyToken, payload);
    }
}
