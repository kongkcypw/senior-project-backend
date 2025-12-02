import { Injectable } from "@nestjs/common";
import { WorkoutProgramPlanRepository } from "../repositories/workout-program-plan.repository";

@Injectable()
export class WorkoutProgramPlanService {
    constructor(
        private readonly workoutProgramPlanRepository: WorkoutProgramPlanRepository,
    ) {}

    async getProgramPlanByPlanId(programPlanId: number) {
        return this.workoutProgramPlanRepository.findFullProgramByProgramPlanId(programPlanId);
    }
}