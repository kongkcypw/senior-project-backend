import { Exclude, Expose, Type } from 'class-transformer';
import { WorkoutExerciseDetailDto } from './workout-exercise-detail.dto';

export class WorkoutDayDefinitionDto {
  @Expose()
  id: number;

  @Expose()
  dayName: string;

  @Expose()
  notes: string | null;

  // Use @Type to ensure class-transformer transforms the nested array of entities into DTOs
  @Expose({ name: 'exerciseDetails' })
  @Type(() => WorkoutExerciseDetailDto)
  exercises: WorkoutExerciseDetailDto[];

  // Exclude internal foreign key and timestamps
  @Exclude()
  programPlanId: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}