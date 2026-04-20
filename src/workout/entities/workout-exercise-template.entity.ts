import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('workout_exercise_template')
export class WorkoutExerciseTemplateEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'name', type: 'varchar', nullable: false })
    name!: string;

    @Column({ name: 'image_url', type: 'varchar', nullable: true })
    imageUrl!: string | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;
}
