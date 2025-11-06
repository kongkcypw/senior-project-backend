import { UserCaloriesPlanEntity } from 'src/users/entities/user-calories-plan.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('notification_schedule')
export class NotificationScheduleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'type', type: 'varchar', nullable: false })
  type: string;

  @Column({ name: 'send_interval', type: 'varchar', nullable: false })
  sendInterval: string;

  @Column({ name: 'send_at', type: 'timestamp', nullable: false })
  sendAt: Date;

  @Column({ name: 'is_active', type: 'boolean', nullable: false })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => UserCaloriesPlanEntity, (plan) => plan.notificationSchedule)
  userCaloriesPlans: UserCaloriesPlanEntity[];
}
