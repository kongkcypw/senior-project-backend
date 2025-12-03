import { Injectable } from "@nestjs/common";
import { WorkoutRoutineRepository } from "../repositories/workout-routine.repository";
import { WorkoutRoutineEntity } from "../entities/workout-routine.entity";

@Injectable()
export class WorkoutRoutineService {
    constructor(
        private readonly workoutRoutineRepository: WorkoutRoutineRepository,
    ) { }

    async deleteById(id: number): Promise<void> {
        await this.workoutRoutineRepository.delete(id);
    }

    async createRoutineWithoutExercises(programId: number, name: string): Promise<WorkoutRoutineEntity> {
        const routine = await this.workoutRoutineRepository.create({
            programId,
            name,
        });

        return routine;
    }
}