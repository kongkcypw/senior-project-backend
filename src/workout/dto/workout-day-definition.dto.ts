import { Exclude, Expose, Type } from 'class-transformer';
import { WorkoutExerciseDetailDto } from './workout-exercise-detail.dto';

export class WorkoutDayDefinitionDto {
  @Expose()
  id: number;

  @Expose()
  dayName: string;

  @Expose({ name: 'exerciseDetails' })
  @Type(() => WorkoutExerciseDetailDto)
  exercises: WorkoutExerciseDetailDto[];

  @Exclude()
  programPlanId: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}