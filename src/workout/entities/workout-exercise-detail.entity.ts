import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { WorkoutDayDefinitionEntity } from './workout-day-definition.entity';

@Entity('workout_exercise_detail')
export class WorkoutExerciseDetailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'workout_day_definition_id', type: 'integer', nullable: false })
  workoutDayDefinitionId: number;

  @Column({ name: 'exercise_name', type: 'varchar', nullable: false })
  exerciseName: string;

  @Column({ name: 'reps', type: 'integer', nullable: false })
  reps: number; // Changed from 'varchar' to 'number'

  @Column({ name: 'sets', type: 'integer', nullable: false })
  sets: number;

  @Column({ name: 'weight_kg', type: 'real', nullable: true })
  weightKg: number | null; // Renamed from prescribedWeightKg

  @Column({ name: 'rest_time_seconds', type: 'integer', nullable: true })
  restTimeSeconds: number | null;

  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl: string | null;

  @Column({ name: 'order_in_day', type: 'integer', nullable: false })
  orderInDay: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => WorkoutDayDefinitionEntity, (day) => day.exerciseDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workout_day_definition_id' })
  workoutDayDefinition: WorkoutDayDefinitionEntity;
}