import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { WorkoutExerciseTemplateEntity } from './workout-exercise-template.entity';

@Entity('workout_routine_template')
export class WorkoutRoutineTemplateEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name', type: 'varchar', nullable: false })
    name: string;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string | null;

    @Column({ name: 'tag', type: 'varchar', nullable: true })
    tag: string | null;

    @Column({ name: 'image_url', type: 'varchar', nullable: true })
    imageUrl: string | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @OneToMany(() => WorkoutExerciseTemplateEntity, (exercise) => exercise.workoutRoutineTemplate)
    exerciseTemplates?: WorkoutExerciseTemplateEntity[];
}