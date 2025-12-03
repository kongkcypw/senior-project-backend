import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { WorkoutRoutineEntity } from './workout-routine.entity';

@Entity('workout_program')
export class WorkoutProgramEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name', type: 'varchar', nullable: false })
    name: string;

    @Column({ name: 'line_user_id_trainee', type: 'varchar', nullable: false })
    lineUserIdTrainee: string;

    @Column({ name: 'line_user_id_trainer', type: 'varchar', nullable: false })
    lineUserIdTrainer: string;

    @Column({ name: 'order_in_program', type: 'integer', default: 1, nullable: false })
    orderInProgram: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(() => UserEntity, (user) => user.traineeWorkoutPrograms, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'line_user_id_trainee', referencedColumnName: 'lineUserId' })
    trainee: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.trainerWorkoutPrograms, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'line_user_id_trainer', referencedColumnName: 'lineUserId' })
    trainer: UserEntity;

    @OneToMany(() => WorkoutRoutineEntity, (routine) => routine.workoutProgram)
    routines?: WorkoutRoutineEntity[];
}