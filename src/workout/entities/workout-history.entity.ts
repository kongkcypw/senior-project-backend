import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { WorkoutRoutineEntity } from './workout-routine.entity';
import { WorkoutHistoryExerciseEntity } from './workout-history-exercise.entity';

@Entity('workout_history_routine')
export class WorkoutHistoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'line_user_id', type: 'varchar', nullable: false })
  lineUserId!: string;

  @Column({ name: 'routine_id', type: 'integer', nullable: false })
  routineId!: number;

  @Column({ name: 'started_at', type: 'timestamp', nullable: false })
  startedAt!: Date;

  @Column({ name: 'finished_at', type: 'timestamp', nullable: true })
  finishedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;

  @ManyToOne(() => UserEntity, (user) => user.workoutHistories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'line_user_id', referencedColumnName: 'lineUserId' })
  user!: UserEntity;

  @ManyToOne(() => WorkoutRoutineEntity, (routine) => routine.workoutHistories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'routine_id' })
  workoutRoutine!: WorkoutRoutineEntity;

  @OneToMany(() => WorkoutHistoryExerciseEntity, (ex: WorkoutHistoryExerciseEntity) => ex.workoutHistoryRoutine, { cascade: true })
  exerciseLogs?: WorkoutHistoryExerciseEntity[];
}
