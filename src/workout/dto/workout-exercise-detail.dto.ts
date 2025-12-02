import { Exclude, Expose } from 'class-transformer';

export class WorkoutExerciseDetailDto {
  @Expose()
  id: number;

  @Expose()
  exerciseName: string;

  @Expose()
  reps: string;

  @Expose()
  sets: number;

  // Rename to clarify
  @Expose({ name: 'prescribedWeightKg' })
  weightKg: number | null;

  @Expose()
  restTimeSeconds: number | null;

  @Expose()
  imageUrl: string | null;

  @Expose()
  orderInDay: number;

  // Exclude internal foreign key and timestamps
  @Exclude()
  workoutDayDefinitionId: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}