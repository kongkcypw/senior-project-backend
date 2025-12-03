import { Injectable } from "@nestjs/common";
import { WorkoutRoutineRepository } from "../repositories/workout-routine.repository";

@Injectable()
export class WorkoutRoutineService {
    constructor(
        private readonly workoutRoutineRepository: WorkoutRoutineRepository,
    ) { }

    async deleteById(id: number): Promise<void> {
        await this.workoutRoutineRepository.delete(id);
    }
}