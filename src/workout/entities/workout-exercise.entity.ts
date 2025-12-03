import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { WorkoutRoutineEntity } from './workout-routine.entity';
import { WorkoutExerciseSetEntity } from './workout-exercise-set.entity';

@Entity('workout_exercise')
export class WorkoutExerciseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'routine_id', type: 'integer', nullable: false })
  routineId: number;

  @Column({ name: 'name', type: 'varchar', nullable: false })
  name: string;

  // --- REMOVED fixed prescription columns (rep, set, weightKg) ---

  @Column({ name: 'rest_time_second', type: 'integer', nullable: true })
  restTimeSecond: number | null;

  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({ name: 'order_in_routine', type: 'integer', nullable: false })
  orderInRoutine: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => WorkoutRoutineEntity, (routine) => routine.exercises, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'routine_id' })
  workoutRoutine: WorkoutRoutineEntity;

  // NEW RELATIONSHIP: Linking to the individual set prescriptions
  @OneToMany(() => WorkoutExerciseSetEntity, (setDetail) => setDetail.workoutExercise)
  setDetails?: WorkoutExerciseSetEntity[];
}