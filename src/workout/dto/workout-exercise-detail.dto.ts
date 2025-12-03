import { Exclude, Expose } from 'class-transformer';

export class WorkoutExerciseDetailDto {
  @Expose()
  id: number;

  @Expose()
  exerciseName: string;

  @Expose()
  reps: number; // Changed type from string to number

  @Expose()
  sets: number;

  @Expose()
  weightKg: number | null;

  @Expose()
  restTimeSeconds: number | null;

  @Expose()
  imageUrl: string | null;

  @Expose()
  orderInDay: number;

  @Exclude()
  workoutDayDefinitionId: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}