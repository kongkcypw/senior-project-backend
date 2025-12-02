import { Injectable } from "@nestjs/common";
import { WorkoutDayDefinitionRepository } from "../repositories/workout-day-definition.repository";

@Injectable()
export class WorkoutDayDefinitionService {
    constructor(
        private readonly workoutDayDefinitionRepository: WorkoutDayDefinitionRepository,
    ) {}

    async deleteById(id: number): Promise<void> {
        await this.workoutDayDefinitionRepository.delete(id);
    }
}