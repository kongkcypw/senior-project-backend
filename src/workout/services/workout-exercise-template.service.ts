import { Injectable } from "@nestjs/common";
import { WorkoutExerciseTemplateRepository } from "../repositories/workout-exercise-template.repository";
import { WorkoutExerciseTemplateEntity } from "../entities/workout-exercise-template.entity";
import { WorkoutExerciseTemplateDto } from "../dto/workout-exercise-template.dto";
import { plainToInstance } from "class-transformer";

@Injectable()
export class WorkoutExerciseTemplateService {
    constructor(
        private readonly workoutExerciseTemplateRepository: WorkoutExerciseTemplateRepository,
    ) { }

    async getAll(): Promise<WorkoutExerciseTemplateDto[]> {
        const rawData = await this.workoutExerciseTemplateRepository.find();
        const transformedDto = rawData.map((data) => WorkoutExerciseTemplateDto.fromEntityToDto(data));
        return transformedDto;
    }

}