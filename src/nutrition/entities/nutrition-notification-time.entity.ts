import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { NutritionPlanEntity } from 'src/nutrition/entities/nutrition-plan.entity';

@Entity('nutrition_notification_time')
export class NutritionNotificationTimeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'nutrition_plan_id', type: 'integer', nullable: false })
    nutritionPlanId: number;

    // The time of day for the notification (HH:mm:ss)
    @Column({ name: 'send_at', type: 'time', nullable: false })
    sendAt: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(() => NutritionPlanEntity, (plan) => plan.notificationTimes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'nutrition_plan_id' })
    nutritionPlan: NutritionPlanEntity;
}