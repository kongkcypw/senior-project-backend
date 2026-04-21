import { Injectable } from "@nestjs/common";
import { WorkoutHistoryRepository } from "../repositories/workout-history.repository";

@Injectable()
export class WorkoutHistoryService {
    constructor(
        private readonly workoutHistoryRepository: WorkoutHistoryRepository,
    ) {}

    getLatestSession(lineUserId: string, routineId: number) {
        return this.workoutHistoryRepository.findLatestSession(lineUserId, routineId);
    }

    getRoutinesDoneThisWeek(lineUserId: string): Promise<number[]> {
        const now = new Date();
        const day = now.getDay();
        const diffToMonday = (day === 0 ? -6 : 1 - day);
        const from = new Date(now);
        from.setDate(now.getDate() + diffToMonday);
        from.setHours(0, 0, 0, 0);
        const to = new Date(from);
        to.setDate(from.getDate() + 7);
        return this.workoutHistoryRepository.findRoutinesDoneThisWeek(lineUserId, from, to);
    }
}