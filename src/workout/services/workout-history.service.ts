import { Injectable } from "@nestjs/common";
import { WorkoutHistoryRepository } from "../repositories/workout-history.repository";

@Injectable()
export class WorkoutHistoryService {
    constructor(
        private readonly workoutHistoryRepository: WorkoutHistoryRepository,
    ) {}
}