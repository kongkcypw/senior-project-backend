import { Exclude, Expose } from 'class-transformer';

export class WorkoutExerciseDto {
  @Expose()
  id: number;

  @Expose()
  name: string; // Renamed from exerciseName

  @Expose()
  rep: number; // Renamed from reps (and type changed to number)

  @Expose()
  set: number; // Renamed from sets

  @Expose()
  weightKg: number | null; // Renamed from prescribedWeightKg

  @Expose()
  restTimeSecond: number | null; // Renamed from restTimeSeconds

  @Expose()
  imageUrl: string | null;

  @Expose()
  orderInRoutine: number; // Renamed from orderInDay

  @Exclude()
  routineId: number; // Renamed FK (private)

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}