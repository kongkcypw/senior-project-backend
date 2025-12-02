import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { WorkoutProgramPlanEntity } from './workout-program-plan.entity';
import { WorkoutExerciseDetailEntity } from './workout-exercise-detail.entity';
import { WorkoutHistoryEntity } from './workout-history.entity';

@Entity('workout_day_definition')
export class WorkoutDayDefinitionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'program_plan_id', type: 'integer', nullable: false })
  programPlanId: number;

  @Column({ name: 'day_name', type: 'varchar', nullable: false })
  dayName: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => WorkoutProgramPlanEntity, (plan) => plan.dayDefinitions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'program_plan_id' })
  workoutProgramPlan: WorkoutProgramPlanEntity;

  @OneToMany(() => WorkoutExerciseDetailEntity, (detail) => detail.workoutDayDefinition)
  exerciseDetails?: WorkoutExerciseDetailEntity[];

  @OneToMany(() => WorkoutHistoryEntity, (log) => log.workoutDayDefinition)
  workoutHistories?: WorkoutHistoryEntity[];
}