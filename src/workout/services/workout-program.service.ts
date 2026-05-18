import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { WorkoutProgramPlanRepository } from "../repositories/workout-program.repository";
import { WorkoutProgramDto } from "../dto/workout-program.dto";
import { UserPhysiqueHistoryRepository } from "src/users/repositories/user-physique-history.repository";
import { RagAgentService } from "src/external/rag-api/services/rag-agent.service";
import { WorkoutRoutineRepository } from "../repositories/workout-routine.repository";
import { WorkoutExerciseRepository } from "../repositories/workout-exercise.repository";
import { WorkoutExerciseSetRepository } from "../repositories/workout-exercise-set.repository";

@Injectable()
export class WorkoutProgramService {
    constructor(
        private readonly workoutProgramPlanRepository: WorkoutProgramPlanRepository,
        private readonly userPhysiqueHistoryRepository: UserPhysiqueHistoryRepository,
        private readonly ragAgentService: RagAgentService,
        private readonly workoutRoutineRepository: WorkoutRoutineRepository,
        private readonly workoutExerciseRepository: WorkoutExerciseRepository,
        private readonly workoutExerciseSetRepository: WorkoutExerciseSetRepository,
    ) { }

    async getProgramPlanByPlanId(programPlanId: number): Promise<WorkoutProgramDto | null> {
        try {
            const plan = await this.workoutProgramPlanRepository.findFullProgramByProgramPlanId(programPlanId);
            if (!plan) {
                return null;
            }
            return WorkoutProgramDto.fromEntityToDto(plan);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            console.error('[WorkoutProgramService] getProgramPlanByPlanId error:', message);
            throw new InternalServerErrorException(message);
        }
    }

    async getProgramPlanByLineUserIdTrainee(lineUserId: string): Promise<WorkoutProgramDto[]> {
        const plans = await this.workoutProgramPlanRepository.findFullProgramByLineUserIdTrainee(lineUserId);
        return plans.map(plan => WorkoutProgramDto.fromEntityToDto(plan));
    }

    async getProgramPlanByLineUserIdTrainer(lineUserId: string): Promise<WorkoutProgramDto[]> {
        const plans = await this.workoutProgramPlanRepository.findFullProgramByLineUserIdTrainer(lineUserId);
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

    async deleteProgramPlan(programPlanId: number): Promise<void> {
        await this.workoutProgramPlanRepository.delete(programPlanId);
    }

    async generateAndSaveProgram(lineUserIdTrainee: string): Promise<WorkoutProgramDto> {
        const physiqueRecords = await this.userPhysiqueHistoryRepository.findByLineUserId(lineUserIdTrainee);
        if (!physiqueRecords || physiqueRecords.length === 0) {
            throw new BadRequestException('กรุณากรอกข้อมูลร่างกายก่อนใช้งานฟีเจอร์นี้');
        }
        const physique = physiqueRecords[0];

        const generated = await this.ragAgentService.generateWorkoutProgram(lineUserIdTrainee, {
            age: physique.age,
            height_cm: physique.heightCm,
            weight_kg: physique.weightKg,
            body_fat_percentage: physique.bodyFatPercentage,
            goal: physique.goal ?? null,
        });

        const program = this.workoutProgramPlanRepository.create({
            name: generated.program_name,
            lineUserIdTrainee,
            lineUserIdTrainer: lineUserIdTrainee,
            routines: [],
        });
        const savedProgram = await this.workoutProgramPlanRepository.save(program);

        for (const routineData of generated.routines) {
            const routine = this.workoutRoutineRepository.create({
                programId: savedProgram.id,
                name: routineData.name,
                orderInProgram: routineData.order,
            });
            const savedRoutine = await this.workoutRoutineRepository.save(routine);

            for (const exerciseData of routineData.exercises) {
                const exercise = this.workoutExerciseRepository.create({
                    routineId: savedRoutine.id,
                    name: exerciseData.name,
                    description: exerciseData.description,
                    imageUrl: null,
                    orderInRoutine: exerciseData.order,
                });
                const savedExercise = await this.workoutExerciseRepository.save(exercise);

                if (exerciseData.sets.length > 0) {
                    const setEntities = exerciseData.sets.map(s =>
                        this.workoutExerciseSetRepository.create({
                            exerciseId: savedExercise.id,
                            set: s.set,
                            rep: s.rep,
                            weightKg: s.weight_kg ?? null,
                        })
                    );
                    await this.workoutExerciseSetRepository.save(setEntities);
                }
            }
        }

        const fullProgram = await this.workoutProgramPlanRepository.findFullProgramByProgramPlanId(savedProgram.id);
        return WorkoutProgramDto.fromEntityToDto(fullProgram!);
    }
}