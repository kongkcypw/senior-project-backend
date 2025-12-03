import { Injectable } from "@nestjs/common";
import { WorkoutProgramPlanRepository } from "../repositories/workout-program.repository";
import { WorkoutProgramDto } from "../dto/workout-program.dto";

@Injectable()
export class WorkoutProgramService {
    constructor(
        private readonly workoutProgramPlanRepository: WorkoutProgramPlanRepository,
    ) { }

    async getProgramPlanByPlanId(programPlanId: number): Promise<WorkoutProgramDto | null> {
        const plan = await this.workoutProgramPlanRepository.findFullProgramByProgramPlanId(programPlanId);
        if (!plan) {
            return null;
        }
        return WorkoutProgramDto.fromEntityToDto(plan);
    }

    async getProgramPlanByLineUserIdTrainee(lineUserId: string): Promise<WorkoutProgramDto[]> {
        const plans = await this.workoutProgramPlanRepository.findFullProgramByLineUserIdTrainee(lineUserId);
        return plans.map(plan => WorkoutProgramDto.fromEntityToDto(plan));
    }

    async createProgramPlan(name: string, lineUserIdTrainee: string, lineUserIdTrainer: string): Promise<WorkoutProgramDto> {
        const newPlan = this.workoutProgramPlanRepository.create({
            name,
            lineUserIdTrainee,
            lineUserIdTrainer,
            routines: [],
        });
        const savedPlan = await this.workoutProgramPlanRepository.save(newPlan);
        return WorkoutProgramDto.fromEntityToDto(savedPlan);
    }
}