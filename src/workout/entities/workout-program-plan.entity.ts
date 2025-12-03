import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { WorkoutDayDefinitionEntity } from './workout-day-definition.entity';
// import { WorkoutScheduleItemEntity } from './workout-schedule-item.entity'; // Removed

@Entity('workout_program_plan')
export class WorkoutProgramPlanEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', nullable: false })
  name: string;

  // Updated to NOT NULL (nullable: false)
  @Column({ name: 'line_user_id_trainee', type: 'varchar', nullable: false })
  lineUserIdTrainee: string; // Changed type to string (not string | null)

  @Column({ name: 'line_user_id_trainer', type: 'varchar', nullable: false })
  lineUserIdTrainer: string;

  // Removed notes, isActive, startDate, endDate columns

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.traineeProgramPlans, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'line_user_id_trainee', referencedColumnName: 'lineUserId' })
  trainee: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.trainerProgramPlans, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'line_user_id_trainer', referencedColumnName: 'lineUserId' })
  trainer: UserEntity;

  @OneToMany(() => WorkoutDayDefinitionEntity, (day) => day.workoutProgramPlan)
  dayDefinitions?: WorkoutDayDefinitionEntity[];

  // Removed scheduleItems relationship
}