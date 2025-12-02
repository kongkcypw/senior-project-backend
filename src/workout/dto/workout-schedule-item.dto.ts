import { Exclude, Expose } from 'class-transformer';

export class WorkoutScheduleItemDto {
  @Expose()
  id: number;

  @Expose()
  scheduleType: 'DAILY' | 'WEEKLY' | 'INTERVAL';

  @Expose()
  frequency: number;

  @Expose()
  intervalValue: number | null;

  @Expose()
  dayOfWeek: number | null; // 1=Mon, 7=Sun

  @Expose()
  preferredTime: string | null;

  // Expose the ID of the day this schedule item refers to
  @Expose()
  workoutDayDefinitionId: number;

  // Exclude internal foreign key and timestamps
  @Exclude()
  programPlanId: number;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}