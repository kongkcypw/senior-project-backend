import { Injectable } from "@nestjs/common";
import { WorkoutProgramPlanRepository } from "../repositories/workout-program-plan.repository";
import { WorkoutProgramPlanDto } from "../dto/workout-program-plan.dto";
import { WorkoutProgramPlanEntity } from "../entities/workout-program-plan.entity";

@Injectable()
export class WorkoutProgramPlanService {
    constructor(
        private readonly workoutProgramPlanRepository: WorkoutProgramPlanRepository,
    ) { }

    async sortDayDefinitions(workoutProgramPlan: WorkoutProgramPlanEntity): Promise<WorkoutProgramPlanEntity> {

        if (!workoutProgramPlan.scheduleItems || !workoutProgramPlan.dayDefinitions) {
            return workoutProgramPlan;
        }

        const dayScheduleMap = workoutProgramPlan.scheduleItems.reduce((map, item) => {
            // The scheduleItem links the dayDefinitionId to the desired dayOfWeek
            map[item.workoutDayDefinitionId] = item.dayOfWeek;
            return map;
        }, {});

        // 2. Sort the dayDefinitions array using the map
        workoutProgramPlan.dayDefinitions.sort((a, b) => {
            const dayA = dayScheduleMap[a.id];
            const dayB = dayScheduleMap[b.id];

            // Handle cases where a day definition might not be scheduled (shouldn't happen here, but safe)
            if (dayA === undefined || dayB === undefined) return 0;

            return dayA - dayB; // Sort by dayOfWeek ASC (1, 2, 3)
        });

        return workoutProgramPlan;
    }

    async getProgramPlanByPlanId(programPlanId: number): Promise<WorkoutProgramPlanDto | null> {
        const plan = await this.workoutProgramPlanRepository.findFullProgramByProgramPlanId(programPlanId);
        if (!plan) {
            return null;
        }
        const sortedPlan = await this.sortDayDefinitions(plan);
        return WorkoutProgramPlanDto.fromEntityToDto(sortedPlan);
    }

    async getProgramPlanByLineUserIdTrainee(lineUserId: string): Promise<WorkoutProgramPlanDto[]> {
        const plans = await this.workoutProgramPlanRepository.findFullProgramByLineUserIdTrainee(lineUserId);
        const sortedPlansPromises = plans.map(async (plan) => {
            return this.sortDayDefinitions(plan);
        });
        const sortedPlans = await Promise.all(sortedPlansPromises);
        return sortedPlans.map(plan => WorkoutProgramPlanDto.fromEntityToDto(plan));
    }

    async createProgramPlan(name: string, lineUserIdTrainee: string, lineUserIdTrainer: string): Promise<WorkoutProgramPlanDto> {
        const newPlan = this.workoutProgramPlanRepository.create({
            name,
            lineUserIdTrainee,
            lineUserIdTrainer,
            dayDefinitions: [],
            scheduleItems: [],
        });
        const savedPlan = await this.workoutProgramPlanRepository.save(newPlan);
        return WorkoutProgramPlanDto.fromEntityToDto(savedPlan);
    }
}