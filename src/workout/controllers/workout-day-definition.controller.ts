import { Controller, Delete, Param, UseGuards } from "@nestjs/common";
import { getProtectedGuards } from "src/utils/guards.util";
import { WorkoutDayDefinitionService } from "../services/workout-day-definition.service";


@Controller('workout-day-definition')
@UseGuards(...getProtectedGuards('liff-jwt'))
export class WorkoutDayDefinitionController {
    constructor(
        private readonly workoutDayDefinitionService: WorkoutDayDefinitionService,
    ) {}

    @Delete(':id')
    async deleteWorkoutDayDefinition(
        @Param('id') id: number,
    ): Promise<void> {
        return this.workoutDayDefinitionService.deleteById(id);
    }
}