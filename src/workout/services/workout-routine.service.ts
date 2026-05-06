import { BadRequestException, Injectable } from "@nestjs/common";
import { WorkoutRoutineRepository } from "../repositories/workout-routine.repository";
import { WorkoutRoutineEntity } from "../entities/workout-routine.entity";
import { WorkoutExerciseDto } from "../dto/workout-exercise.dto";
import { WorkoutExerciseRepository } from "../repositories/workout-exercise.repository";
import { WorkoutExerciseSetRepository } from "../repositories/workout-exercise-set.repository";
import { Transactional } from "typeorm-transactional";
import { WorkoutExerciseResponseDto, WorkoutExerciseSetResponseDto, WorkoutRoutineResponseDto } from "../dto/workout-program.dto";
import { In } from "typeorm";

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
                sd.rep     = s.rep;
                sd.weight   = s.weightKg;
                return sd;
            });
            return e;
        });
        return dto;
    }

    async deleteExercise(exerciseId: number): Promise<void> {
        await this.exerciseRepository.delete(exerciseId);
    }

    async addExercisesToRoutine(
        routineId: number,
        exercises: { name: string; imageUrl: string | null }[],
    ): Promise<void> {
        const existing = await this.exerciseRepository.find({
            where: { routineId },
            order: { orderInRoutine: 'DESC' },
            take: 1,
        });
        const nextOrder = (existing[0]?.orderInRoutine ?? 0) + 1;

        const entities = exercises.map((e, i) =>
            this.exerciseRepository.create({
                routineId,
                name: e.name,
                imageUrl: e.imageUrl,
                description: null,
                orderInRoutine: nextOrder + i,
            }),
        );
        await this.exerciseRepository.save(entities);
    }

    async addSetsToExercise(
        exerciseId: number,
        sets: { set: number; rep: number; weightKg: number | null }[],
    ): Promise<void> {
        const entities = sets.map((s) =>
            this.setRepository.create({ exerciseId, set: s.set, rep: s.rep, weightKg: s.weightKg }),
        );
        await this.setRepository.save(entities);
    }

    @Transactional()
    async updateRoutine(
        routineId: number,
        exercises: {
            id?: number;
            name: string;
            imageUrl: string | null;
            description: string | null;
            orderInRoutine: number;
            sets: { set: number; rep: number; weightKg: number | null }[];
        }[],
    ): Promise<void> {
        const existing = await this.exerciseRepository.find({ where: { routineId } });
        const existingIds = new Set(existing.map((e) => e.id));

        const incomingIds = new Set(exercises.filter((e) => e.id != null).map((e) => e.id as number));
        for (const id of incomingIds) {
            if (!existingIds.has(id)) {
                throw new BadRequestException(`Exercise id ${id} does not belong to routine ${routineId}`);
            }
        }

        // Validate set numbers / reps before touching DB
        for (const ex of exercises) {
            const seen = new Set<number>();
            for (const s of ex.sets ?? []) {
                if (s.set == null || !Number.isInteger(s.set) || s.set <= 0) {
                    throw new BadRequestException(`Invalid set number: ${s.set}`);
                }
                if (seen.has(s.set)) {
                    throw new BadRequestException(`Duplicate set number ${s.set} for exercise ${ex.id ?? '(new)'}`);
                }
                seen.add(s.set);

                if (s.rep == null || !Number.isInteger(s.rep) || s.rep < 0) {
                    throw new BadRequestException(`Invalid rep: ${s.rep}`);
                }
                if (s.weightKg != null && typeof s.weightKg !== 'number') {
                    throw new BadRequestException(`Invalid weightKg: ${s.weightKg}`);
                }
            }
        }

        // Delete exercises removed from payload
        const toDelete = existing.filter((e) => !incomingIds.has(e.id)).map((e) => e.id);
        if (toDelete.length > 0) {
            await this.exerciseRepository.delete(toDelete);
        }

        // Upsert exercises (existing + new)
        const entitiesToSave = exercises.map((ex) =>
            this.exerciseRepository.create({
                ...(ex.id ? { id: ex.id } : {}),
                routineId,
                name: ex.name,
                imageUrl: ex.imageUrl,
                description: ex.description ?? null,
                orderInRoutine: ex.orderInRoutine,
            }),
        );
        const savedExercises = await this.exerciseRepository.save(entitiesToSave);

        // Replace sets for all saved exercises
        const savedIds = savedExercises.map((e) => e.id);
        if (savedIds.length > 0) {
            await this.setRepository.delete({ exerciseId: In(savedIds) });

            const allSetEntities = savedExercises.flatMap((savedEx, idx) => {
                const reqEx = exercises[idx];
                const sets = reqEx?.sets ?? [];
                return sets.map((s) =>
                    this.setRepository.create({
                        exerciseId: savedEx.id,
                        set: s.set,
                        rep: s.rep,
                        weightKg: s.weightKg,
                    }),
                );
            });

            if (allSetEntities.length > 0) {
                await this.setRepository.save(allSetEntities);
            }
        }
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