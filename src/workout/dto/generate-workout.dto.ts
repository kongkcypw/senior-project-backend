import { IsString } from "class-validator";

export class GenerateWorkoutDto {
    @IsString()
    lineUserIdTrainee: string;
}
