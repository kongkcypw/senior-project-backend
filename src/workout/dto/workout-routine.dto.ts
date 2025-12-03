import { Exclude, Expose, Type } from 'class-transformer';
import { WorkoutExerciseDto } from './workout-exercise.dto';

export class WorkoutRoutineDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  orderInProgram: number;

  // Removed notes property

  @Expose({ name: 'exercises' }) // Exposed property name
  @Type(() => WorkoutExerciseDto)
  exercises: WorkoutExerciseDto[];

  @Exclude()
  programId: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}