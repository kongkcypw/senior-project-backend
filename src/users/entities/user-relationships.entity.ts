import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user_relationships') // <-- The chosen table name
export class UserRelationshipEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'trainee_line_user_id', type: 'varchar', nullable: false })
    traineeLineUserId: string;

    @Column({ name: 'trainer_line_user_id', type: 'varchar', nullable: false })
    trainerLineUserId: string;

    @CreateDateColumn({ name: 'assigned_at', type: 'timestamp', nullable: false })
    assignedAt: Date;

    @Column({ name: 'unassigned_at', type: 'timestamp', default: null, nullable: true })
    unassignedAt: Date | null;

    @Column({ name: 'is_active', type: 'boolean', default: true, nullable: false })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(() => UserEntity, (user) => user.traineeRelationships, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'trainee_line_user_id', referencedColumnName: 'lineUserId' })
    trainee: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.trainerRelationships, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'trainer_line_user_id', referencedColumnName: 'lineUserId' })
    trainer: UserEntity;
}