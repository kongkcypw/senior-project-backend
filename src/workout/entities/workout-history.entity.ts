import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { WorkoutRoutineEntity } from './workout-routine.entity';
import { WorkoutExerciseEntity } from './workout-exercise.entity';

@Entity('workout_history')
export class WorkoutHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'line_user_id', type: 'varchar', nullable: false })
  lineUserId: string;

  @Column({ name: 'routine_id', type: 'integer', nullable: false })
  routineId: number;

  @Column({ name: 'started_at', type: 'timestamp', nullable: false })
  startedAt: Date;

  @Column({ name: 'finished_at', type: 'timestamp', nullable: false })
  finishedAt: Date;

  @Column({ name: 'set', type: 'integer', nullable: false })
  setNumber: number;

  @Column({ name: 'rep', type: 'integer', nullable: false })
  actualReps: number;

  @Column({ name: 'weight_kg', type: 'float', nullable: false })
  actualWeightKg: number;

  @Column({ name: 'exercise_id', type: 'integer', nullable: false })
  exerciseId: number;

  @Column({ name: 'notes', type: 'varchar', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.workoutHistories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'line_user_id', referencedColumnName: 'lineUserId' })
  user: UserEntity;

  @ManyToOne(() => WorkoutRoutineEntity, (routine) => routine.workoutHistories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'routine_id' })
  workoutRoutine: WorkoutRoutineEntity;

  @ManyToOne(() => WorkoutExerciseEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exercise_id' })
  workoutExercise: WorkoutExerciseEntity;
}