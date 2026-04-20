import { Injectable } from "@nestjs/common";
import { WorkoutRoutineRepository } from "../repositories/workout-routine.repository";
import { WorkoutRoutineEntity } from "../entities/workout-routine.entity";
import { WorkoutExerciseDto } from "../dto/workout-exercise.dto";
import { WorkoutExerciseRepository } from "../repositories/workout-exercise.repository";
import { WorkoutExerciseSetRepository } from "../repositories/workout-exercise-set.repository";
import { Transactional } from "typeorm-transactional";
import { WorkoutExerciseResponseDto, WorkoutExerciseSetResponseDto, WorkoutRoutineResponseDto } from "../dto/workout-program.dto";

@Injectable()
export class WorkoutRoutineService {
    constructor(
        private readonly workoutRoutineRepository: WorkoutRoutineRepository,
        private readonly exerciseRepository: WorkoutExerciseRepository,
        private readonly setRepository: WorkoutExerciseSetRepository,
    ) { }

    async getById(id: number): Promise<WorkoutRoutineResponseDto | null> {
        const routine = await this.workoutRoutineRepository.findByIdWithExercisesAndSets(id);
        if (!routine) return null;

        const dto = new WorkoutRoutineResponseDto();
        dto.id             = routine.id;
        dto.name           = routine.name;
        dto.orderInProgram = routine.orderInProgram;
        dto.exercises      = (routine.exercises ?? []).map((ex) => {
            const e         = new WorkoutExerciseResponseDto();
            e.id             = ex.id;
            e.name           = ex.name;
            e.imageUrl       = ex.imageUrl;
            e.restTimeSecond = null;
            e.orderInRoutine = ex.orderInRoutine;
            e.description    = ex.description;
            e.sets           = (ex.setDetails ?? []).map((s) => {
                const sd      = new WorkoutExerciseSetResponseDto();
                sd.id       = s.id;
                sd.setNumber = s.set;
                sd.reps     = s.rep;
                sd.weight   = s.weightKg;
                return sd;
            });
            return e;
        });
        return dto;
    }

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

    @Transactional()
    async createRoutineWithExercises(
        lineUserId: string,
        programId: number,
        name: string,
        exercises: WorkoutExerciseDto[]
    ): Promise<WorkoutRoutineEntity | null> {

        if (exercises.length === 0) {
            throw new Error('No exercises provided');
        }

        const latestRoutineOrder = await this.workoutRoutineRepository.find({
            where: { programId },
            order: { orderInProgram: 'DESC' },
            take: 1,
        });

        let newOrderId = 1;

        if (latestRoutineOrder.length > 0) {
            newOrderId = latestRoutineOrder[0].orderInProgram + 1;
        }

        // Create the parent Routine
        const routine = this.workoutRoutineRepository.create({
            programId,
            name,
            orderInProgram: newOrderId,
        });
        const savedRoutine = await this.workoutRoutineRepository.save(routine);

        // Iterate through exercises and create children
        for (const exerciseDto of exercises) {

            // Create the Exercise record
            const exercise = this.exerciseRepository.create({
                routineId: savedRoutine.id,
                name: exerciseDto.name,
                imageUrl: exerciseDto.imageUrl,
                description: exerciseDto.description,
                orderInRoutine: exerciseDto.orderInRoutine,
            });
            // We use save() here, relying on the @Transactional() wrapper to manage the underlying connection
            const savedExercise = await this.exerciseRepository.save(exercise);

            // Handle Sets
            if (exerciseDto.setDetails && exerciseDto.setDetails.length > 0) {
                const setEntities = exerciseDto.setDetails.map((setDto) => this.setRepository.create({
                    exerciseId: savedExercise.id,
                    set: setDto.set,
                    rep: setDto.rep,
                    weightKg: setDto.weightKg,
                }));
                // Bulk save the sets
                await this.setRepository.save(setEntities);
            }
        }

        // 3. Fetch the final entity with relations for the return value
        // Note: The transaction might still be open here. The decorator commits/rolls back
        // AFTER this method returns successfully or throws an error.
        // and reflects the changes made inside the transaction.
        const finalRoutine = await this.workoutRoutineRepository.findOne({
            where: { id: savedRoutine.id },
            relations: ['exercises', 'exercises.setDetails']
        });

        if (!finalRoutine) {
            throw new Error('Cannot find created routine');
        }

        return finalRoutine; // Transaction commits upon successful return
    }
}