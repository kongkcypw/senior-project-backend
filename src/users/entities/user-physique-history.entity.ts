import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity('user_physique_history')
export class UserPhysiqueHistoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'line_user_id', type: 'varchar', unique: true, nullable: false })
    lineUserId: string;

    @Column({ name: 'age', type: 'integer', nullable: false })
    age: number;

    @Column({ name: 'height_cm', type: 'integer', nullable: false })
    heightCm: number;

    @Column({ name: 'weight_kg', type: 'float', nullable: false })
    weightKg: number;

    @Column({ name: 'body_fat_percentage', type: 'float', nullable: true })
    bodyFatPercentage: number | null;

    @Column({ name: 'goal', type: 'varchar', length: 255, nullable: true })
    goal: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(() => UserEntity, (user) => user.physiqueHistory, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'line_user_id', referencedColumnName: 'lineUserId' })
    user: UserEntity;
}