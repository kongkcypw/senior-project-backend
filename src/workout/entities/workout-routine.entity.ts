import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { WorkoutProgramEntity } from './workout-program.entity'; // Renamed import
import { WorkoutHistoryEntity } from './workout-history.entity';
import { WorkoutExerciseEntity } from './workout-exercise.entity';

@Entity('workout_routine') // Renamed table
export class WorkoutRoutineEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'program_id', type: 'integer', nullable: false })
  programId: number; // Renamed FK column

  @Column({ name: 'name', type: 'varchar', nullable: false })
  name: string; // Renamed from dayName

  @Column({ name: 'order_in_program', type: 'integer', default: 1, nullable: false })
  orderInProgram: number;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => WorkoutProgramEntity, (program) => program.routines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'program_id' })
  workoutProgram: WorkoutProgramEntity;

  @OneToMany(() => WorkoutExerciseEntity, (detail) => detail.workoutRoutine)
  exercises?: WorkoutExerciseEntity[];

  @OneToMany(() => WorkoutHistoryEntity, (log) => log.workoutRoutine)
  workoutHistories?: WorkoutHistoryEntity[];
}