import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { WorkoutRoutineEntity } from './workout-routine.entity'; // Renamed import

@Entity('workout_history')
export class WorkoutHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'line_user_id', type: 'varchar', nullable: false })
  lineUserId: string;

  @Column({ name: 'routine_id', type: 'integer', nullable: false })
  routineId: number;

  @Column({ name: 'performed_at', type: 'timestamp', nullable: false })
  performedAt: Date;

  @Column({ name: 'set_number', type: 'integer', nullable: false })
  setNumber: number;

  @Column({ name: 'actual_reps', type: 'integer', nullable: false })
  actualReps: number;

  @Column({ name: 'actual_weight_kg', type: 'float', nullable: false })
  actualWeightKg: number;

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
}