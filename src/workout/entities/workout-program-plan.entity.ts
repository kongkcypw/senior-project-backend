import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { WorkoutDayDefinitionEntity } from './workout-day-definition.entity';
import { WorkoutScheduleItemEntity } from './workout-schedule-item.entity';

@Entity('workout_program_plan')
export class WorkoutProgramPlanEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', nullable: false })
  name: string;

  // Nullable to support program templates
  @Column({ name: 'line_user_id_trainee', type: 'varchar', nullable: true })
  lineUserIdTrainee: string | null;

  @Column({ name: 'line_user_id_trainer', type: 'varchar', nullable: false })
  lineUserIdTrainer: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true, nullable: false })
  isActive: boolean;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date | null;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.traineeProgramPlans, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'line_user_id_trainee', referencedColumnName: 'lineUserId' })
  trainee: UserEntity;

  // Trainer (ManyToOne)
  @ManyToOne(() => UserEntity, (user) => user.trainerProgramPlans, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'line_user_id_trainer', referencedColumnName: 'lineUserId' })
  trainer: UserEntity;

  // Day Definitions (OneToMany)
  @OneToMany(() => WorkoutDayDefinitionEntity, (day) => day.workoutProgramPlan)
  dayDefinitions?: WorkoutDayDefinitionEntity[];

  // Schedule Items (OneToMany)
  @OneToMany(() => WorkoutScheduleItemEntity, (schedule) => schedule.workoutProgramPlan)
  scheduleItems?: WorkoutScheduleItemEntity[];
}