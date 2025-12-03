import { Injectable } from "@nestjs/common";
import { WorkoutProgramPlanRepository } from "../repositories/workout-program-plan.repository";
import { WorkoutProgramPlanDto } from "../dto/workout-program-plan.dto";
import { WorkoutProgramPlanEntity } from "../entities/workout-program-plan.entity";

@Injectable()
export class WorkoutProgramPlanService {
    constructor(
        private readonly workoutProgramPlanRepository: WorkoutProgramPlanRepository,
    ) { }

    async getProgramPlanByPlanId(programPlanId: number): Promise<WorkoutProgramPlanDto | null> {
        const plan = await this.workoutProgramPlanRepository.findFullProgramByProgramPlanId(programPlanId);
        if (!plan) {
            return null;
        }
        return WorkoutProgramPlanDto.fromEntityToDto(plan);
    }

    async getProgramPlanByLineUserIdTrainee(lineUserId: string): Promise<WorkoutProgramPlanDto[]> {
        const plans = await this.workoutProgramPlanRepository.findFullProgramByLineUserIdTrainee(lineUserId);
        return plans.map(plan => WorkoutProgramPlanDto.fromEntityToDto(plan));
    }

    async createProgramPlan(name: string, lineUserIdTrainee: string, lineUserIdTrainer: string): Promise<WorkoutProgramPlanDto> {
        const newPlan = this.workoutProgramPlanRepository.create({
            name,
            lineUserIdTrainee,
            lineUserIdTrainer,
            dayDefinitions: [],
        });
        const savedPlan = await this.workoutProgramPlanRepository.save(newPlan);
        return WorkoutProgramPlanDto.fromEntityToDto(savedPlan);
    }
}