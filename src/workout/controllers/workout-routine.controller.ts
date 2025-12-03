import { Controller, Delete, Param, UseGuards } from "@nestjs/common";
import { getProtectedGuards } from "src/utils/guards.util";
import { WorkoutRoutineService } from "../services/workout-routine.service";


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
}