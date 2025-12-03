import { Body, Controller, Delete, Param, Post, UseGuards } from "@nestjs/common";
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

    @Delete(':id')
    async deleteWorkoutRoutine(
        @Param('id') id: number,
    ): Promise<void> {
        return this.workoutRoutineService.deleteById(id);
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