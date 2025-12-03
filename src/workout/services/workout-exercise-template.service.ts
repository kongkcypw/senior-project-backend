import { Injectable } from "@nestjs/common";
import { WorkoutExerciseTemplateRepository } from "../repositories/workout-exercise-template.repository";
import { WorkoutExerciseTemplateEntity } from "../entities/workout-exercise-template.entity";

@Injectable()
export class WorkoutExerciseTemplateService {
    constructor(
        private readonly workoutExerciseTemplateRepository: WorkoutExerciseTemplateRepository,
    ) { }

    async getAll(): Promise<WorkoutExerciseTemplateEntity[]> {
        return this.workoutExerciseTemplateRepository.find();
    }

}