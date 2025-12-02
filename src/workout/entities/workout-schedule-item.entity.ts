import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { WorkoutProgramPlanEntity } from './workout-program-plan.entity';
import { WorkoutDayDefinitionEntity } from './workout-day-definition.entity';

@Entity('workout_schedule_item')
export class WorkoutScheduleItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'program_plan_id', type: 'integer', nullable: false })
  programPlanId: number;

  @Column({ name: 'workout_day_definition_id', type: 'integer', nullable: false })
  workoutDayDefinitionId: number;

  @Column({ name: 'schedule_type', type: 'varchar', nullable: false})
  scheduleType: 'DAILY' | 'WEEKLY' | 'INTERVAL';

  @Column({ name: 'frequency', type: 'integer', default: 1, nullable: false})
  frequency: number;

  @Column({ name: 'interval_value', type: 'integer', nullable: true })
  intervalValue: number | null;

  @Column({ name: 'day_of_week', type: 'integer', nullable: true })
  dayOfWeek: number | null;

  @Column({ name: 'preferred_time', type: 'time', nullable: true })
  preferredTime: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => WorkoutProgramPlanEntity, (plan) => plan.scheduleItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'program_plan_id' })
  workoutProgramPlan: WorkoutProgramPlanEntity;

  @ManyToOne(() => WorkoutDayDefinitionEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workout_day_definition_id' })
  workoutDayDefinition: WorkoutDayDefinitionEntity;
}