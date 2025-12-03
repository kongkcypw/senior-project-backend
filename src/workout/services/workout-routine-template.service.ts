import { Injectable } from "@nestjs/common";
import { WorkoutRoutineTemplateRepository } from "../repositories/workout-routine-template.repository";
import { WorkoutRoutineTemplateEntity } from "../entities/workout-routine-template.entity";

@Injectable()
export class WorkoutRoutineTemplateService {
    constructor(
        private readonly workoutRoutineTemplateRepository: WorkoutRoutineTemplateRepository,
    ) { }

    async getAll(): Promise<WorkoutRoutineTemplateEntity[]> {
        return this.workoutRoutineTemplateRepository.find();
    }
}