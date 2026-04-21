import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { WorkoutHistoryEntity } from './workout-history.entity';
import { WorkoutExerciseEntity } from './workout-exercise.entity';

@Entity('workout_history_exercise')
export class WorkoutHistoryExerciseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'workout_history_routine_id', type: 'integer', nullable: false })
  workoutHistoryRoutineId!: number;

  @Column({ name: 'exercise_id', type: 'integer', nullable: false })
  exerciseId!: number;

  @Column({ name: 'set', type: 'integer', nullable: false })
  setNumber!: number;

  @Column({ name: 'rep', type: 'integer', nullable: false })
  rep!: number;

  @Column({ name: 'weight_kg', type: 'float', nullable: true })
  weightKg!: number | null;

  @Column({ name: 'notes', type: 'varchar', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @ManyToOne(() => WorkoutHistoryEntity, (h) => h.exerciseLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workout_history_routine_id' })
  workoutHistoryRoutine!: WorkoutHistoryEntity;

  @ManyToOne(() => WorkoutExerciseEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exercise_id' })
  workoutExercise!: WorkoutExerciseEntity;
}
