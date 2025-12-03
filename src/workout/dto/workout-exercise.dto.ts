import { Exclude, Expose } from 'class-transformer';
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
  restTimeSecond: number | null;

  @Expose()
  sets: WorkoutExerciseSetDto[];

  @Exclude()
  routineId: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}