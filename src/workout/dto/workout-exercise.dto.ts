import { Exclude, Expose, Type } from 'class-transformer';
import { WorkoutExerciseSetDto } from './workout-exercise-set.dto';

export class WorkoutExerciseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  imageUrl: string | null;

  @Expose()
  orderInRoutine: number;

  @Expose()
  description: string | null;

  @Expose()
  @Type(() => WorkoutExerciseSetDto)
  setDetails: WorkoutExerciseSetDto[];

  @Exclude()
  routineId: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}