import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { getProtectedGuards } from "src/utils/guards.util";
import { WorkoutRoutineService } from "../services/workout-routine.service";
import { WorkoutRoutineEntity } from "../entities/workout-routine.entity";
import { WorkoutExerciseDto } from "../dto/workout-exercise.dto";


@Controller('workout-routine')
@UseGuards(...getProtectedGuards('liff-jwt'))
export class WorkoutRoutineController {
    constructor(
        private readonly workoutRoutineService: WorkoutRoutineService,
    ) { }

    @Get(':id')
    async getById(@Param('id') id: number) {
        return this.workoutRoutineService.getById(id);
    }

    @Delete(':id')
    async deleteWorkoutRoutine(
        @Param('id') id: number,
    ): Promise<void> {
        return this.workoutRoutineService.deleteById(id);
    }

    @Delete('exercise/:exerciseId')
    async deleteExercise(@Param('exerciseId') exerciseId: number): Promise<void> {
        return this.workoutRoutineService.deleteExercise(Number(exerciseId));
    }

    @Post(':routineId/exercises')
    async addExercisesToRoutine(
        @Param('routineId') routineId: number,
        @Body() body: { exercises: { name: string; imageUrl: string | null }[] },
    ): Promise<void> {
        return this.workoutRoutineService.addExercisesToRoutine(Number(routineId), body.exercises);
    }

    @Post('exercise/:exerciseId/sets')
    async addSetsToExercise(
        @Param('exerciseId') exerciseId: number,
        @Body() body: { sets: { set: number; rep: number; weightKg: number | null }[] },
    ): Promise<void> {
        return this.workoutRoutineService.addSetsToExercise(Number(exerciseId), body.sets);
    }

    /**
     * PUT /workout-routine/:routineId
     * Fully sync exercises + sets for a routine.
     * - Creates new exercises when id is omitted
     * - Deletes exercises not present in payload
     * - Replaces all sets for each exercise
     */
    @Put(':routineId')
    async updateRoutine(
        @Param('routineId') routineId: number,
        @Body()
        body: {
            exercises: {
                id?: number;
                name: string;
                imageUrl: string | null;
                description: string | null;
                orderInRoutine: number;
                sets: { set: number; rep: number; weightKg: number | null }[];
            }[];
        },
    ): Promise<void> {
        return this.workoutRoutineService.updateRoutine(Number(routineId), body.exercises);
    }

    @Post('')
    async create(
        @Body() workoutRoutine: WorkoutRoutineEntity
    ): Promise<WorkoutRoutineEntity> {
        return this.workoutRoutineService.createRoutineWithoutExercises(workoutRoutine.programId, workoutRoutine.name);
    }

    @Post('/create-with-exercises')
    async createWithExercises(
        @Body() body: {
            lineUserId: string;
            programId: number;
            name: string;
            exercises: WorkoutExerciseDto[];
        }
    ): Promise<WorkoutRoutineEntity | null> {
        return this.workoutRoutineService.createRoutineWithExercises(body.lineUserId, body.programId, body.name, body.exercises);
    }
}