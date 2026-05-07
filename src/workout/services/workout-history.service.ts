import { Injectable } from "@nestjs/common";
import { LatestCompletedSessionSummary, WorkoutHistoryRepository } from "../repositories/workout-history.repository";
import { WorkoutHistoryExerciseRepository } from "../repositories/workout-history-exercise.repository";
import { LogSessionDto } from "../dto/log-session.dto";
import { weeklyWindow } from "src/common/utils/score.util";
import { WorkoutProgramPlanRepository } from "../repositories/workout-program.repository";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { LineGroupMemberService } from "src/line-group/services/line-group-member.service";
import { LineLiffNavigatePathService } from "src/external/line-liff/services/line-liff-navigate-path.service";
import { LastWorkoutSessionCardData, LastWorkoutSessionMessages } from "src/webhook/dialogflow/messages/last-workout-session.message";
import { FeatureFlagService } from "src/feature-flag/services/feature-flag.service";
import { FeatureFlagKey } from "src/feature-flag/enums/feature-flag.constant";

@Injectable()
export class WorkoutHistoryService {
    constructor(
        private readonly workoutHistoryRepository: WorkoutHistoryRepository,
        private readonly workoutHistoryExerciseRepository: WorkoutHistoryExerciseRepository,
        private readonly workoutProgramPlanRepository: WorkoutProgramPlanRepository,
        private readonly lineMessagingApiService: LineMessagingApiClientService,
        private readonly lineGroupMemberService: LineGroupMemberService,
        private readonly lineLiffNavigatePathService: LineLiffNavigatePathService,
        private readonly featureFlagService: FeatureFlagService,
    ) {}

    async getActiveSession(lineUserId: string) {
        const session = await this.workoutHistoryRepository.findActiveSession(lineUserId);
        if (!session) return null;
        return {
            sessionId: session.id,
            routineId: session.routineId,
            routineName: session.workoutRoutine?.name ?? null,
            startedAt: session.startedAt.toISOString(),
        };
    }

    async discardSession(sessionId: number): Promise<void> {
        await this.workoutHistoryRepository.deleteSession(sessionId);
    }

    getLatestSession(lineUserId: string, routineId: number) {
        return this.workoutHistoryRepository.findLatestSession(lineUserId, routineId);
    }

    async startSession(lineUserId: string, routineId: number): Promise<{ sessionId: number; startedAt: string }> {
        const session = await this.workoutHistoryRepository.createSession(lineUserId, routineId);
        return { sessionId: session.id, startedAt: session.startedAt.toISOString() };
    }

    async logSession(dto: LogSessionDto): Promise<void> {
        const finishedAt = new Date(dto.finishedAt);
        await this.workoutHistoryRepository.finishSession(dto.sessionId, finishedAt);
        await this.workoutHistoryExerciseRepository.saveExerciseLogs(dto.sessionId, dto.sets);

        await this.pushLastWorkoutSessionMessage(dto);
    }

    getRoutinesDoneThisWeek(lineUserId: string): Promise<number[]> {
        const { from, to } = weeklyWindow();
        return this.workoutHistoryRepository.findRoutinesDoneThisWeek(lineUserId, from, to);
    }

    getDistinctSessionDaysThisWeek(lineUserId: string): Promise<number> {
        const { from, to } = weeklyWindow();
        return this.workoutHistoryRepository.countDistinctSessionDays(lineUserId, from, to);
    }

    getLatestCompletedSessionSummary(lineUserId: string): Promise<LatestCompletedSessionSummary | null> {
        return this.workoutHistoryRepository.findLatestCompletedSessionSummary(lineUserId);
    }

    getSessionList(lineUserId: string, limit = 20) {
        return this.workoutHistoryRepository.findSessionList(lineUserId, limit);
    }

    getSessionDetail(sessionId: number) {
        return this.workoutHistoryRepository.findSessionDetail(sessionId);
    }

    private async pushLastWorkoutSessionMessage(dto: LogSessionDto): Promise<void> {
        const isPushEnabled = await this.featureFlagService.isEnabled(FeatureFlagKey.PUSH_MESSAGE_FOR_LIFF_ACTION);
        if (!isPushEnabled) return;

        const session = await this.workoutHistoryRepository.findOne({
            where: { id: dto.sessionId },
            relations: ['workoutRoutine', 'workoutRoutine.workoutProgram'],
        });
        if (!session) return;

        const lineUserId = session.lineUserId;
        const groupId = await this.lineGroupMemberService.findGroupIdByMemberLineUserId(lineUserId);
        if (!groupId) return;

        const { from, to } = weeklyWindow();
        const completedRoutineIds = await this.workoutHistoryRepository.findRoutinesDoneThisWeek(lineUserId, from, to);
        const totalRoutines = await this.workoutProgramPlanRepository.countRoutinesByTrainee(lineUserId);

        const exerciseCount = new Set(dto.sets.map(s => s.exerciseId)).size;
        const d = new Date(dto.finishedAt);
        const sessionDateText = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;

        const lastSessionData: LastWorkoutSessionCardData = {
            programName: session.workoutRoutine?.workoutProgram?.name ?? '-',
            sessionName: session.workoutRoutine?.name ?? '-',
            exerciseCount,
            sessionDateText,
            completedSessionsThisWeek: completedRoutineIds.length,
            totalRoutines,
            navigateUrl: this.lineLiffNavigatePathService.getRoutineDetailPage(lineUserId, session.routineId.toString()),
        };

        const workoutPlanUrl = this.lineLiffNavigatePathService.getWorkoutPlanPage(lineUserId);
        const messages = LastWorkoutSessionMessages(lastSessionData, workoutPlanUrl);
        await this.lineMessagingApiService.sendPushMessages(groupId, messages);
    }
}
