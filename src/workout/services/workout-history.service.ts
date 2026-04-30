import { Injectable } from "@nestjs/common";
import { LatestCompletedSessionSummary, WorkoutHistoryRepository } from "../repositories/workout-history.repository";
import { WorkoutHistoryExerciseRepository } from "../repositories/workout-history-exercise.repository";
import { LogSessionDto } from "../dto/log-session.dto";
import { weeklyWindow } from "src/common/utils/score.util";

@Injectable()
export class WorkoutHistoryService {
    constructor(
        private readonly workoutHistoryRepository: WorkoutHistoryRepository,
        private readonly workoutHistoryExerciseRepository: WorkoutHistoryExerciseRepository,
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
}
