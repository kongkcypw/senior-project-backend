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
}