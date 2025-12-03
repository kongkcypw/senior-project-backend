import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { WorkoutRoutineTemplateEntity } from './workout-routine-template.entity';

@Entity('workout_exercise_template')
export class WorkoutExerciseTemplateEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'routine_template_id', type: 'integer', nullable: true })
    routineTemplateId: number | null;

    @Column({ name: 'name', type: 'varchar', nullable: false })
    name: string;

    @Column({ name: 'rest_time_second', type: 'integer', nullable: true })
    restTimeSecond: number | null;

    @Column({ name: 'image_url', type: 'varchar', nullable: true })
    imageUrl: string | null;

    @Column({ name: 'order_in_routine', type: 'integer', nullable: true })
    orderInRoutine: number | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(() => WorkoutRoutineTemplateEntity, (routine) => routine.exerciseTemplates, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'routine_template_id' })
    workoutRoutineTemplate: WorkoutRoutineTemplateEntity;
}