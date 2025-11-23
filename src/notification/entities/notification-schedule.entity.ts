import { NutritionPlanEntity } from 'src/nutrition/entities/nutrition-plan.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('notification_schedule')
export class NotificationScheduleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'type', type: 'varchar', nullable: false })
  type: string;

  @Column({ name: 'send_interval', type: 'varchar', nullable: false })
  sendInterval: string;

  @Column({ name: 'send_at', type: 'time', nullable: false })
  sendAt: string; // Only time of day (HH:mm:ss)

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => NutritionPlanEntity, (plan) => plan.notificationSchedule)
  nutritionPlan: NutritionPlanEntity[];
}
