import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { WorkoutExerciseEntity } from './workout-exercise.entity';

@Entity('workout_exercise_set')
export class WorkoutExerciseSetEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'exercise_id', type: 'integer', nullable: false })
    exerciseId: number;

    @Column({ name: 'set', type: 'integer', nullable: false })
    set: number;

    @Column({ name: 'rep', type: 'integer', nullable: false })
    rep: number;

    @Column({ name: 'weight_kg', type: 'real', nullable: true })
    weightKg: number | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    // Relationship to the parent exercise
    @ManyToOne(() => WorkoutExerciseEntity, (exercise) => exercise.setDetails, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'exercise_id' })
    workoutExercise: WorkoutExerciseEntity;
}