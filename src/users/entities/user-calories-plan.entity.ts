import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { NotificationScheduleEntity } from 'src/notification/entities/notification-schedule.entity';

@Entity('user_calories_plan')
export class UserCaloriesPlanEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'integer', nullable: false })
  userId: number;

  @Column({ name: 'total_calories', type: 'integer', nullable: false })
  totalCalories: number;

  @Column({ name: 'protein', type: 'integer', nullable: false })
  protein: number;

  @Column({ name: 'carbohydrate', type: 'integer', nullable: false })
  carbohydrate: number;

  @Column({ name: 'fat', type: 'integer', nullable: false })
  fat: number;

  @Column({ name: 'need_notificiation', type: 'boolean', nullable: false })
  needNotification: boolean;

  @Column({ name: 'notification_schedule_id', type: 'integer', nullable: false })
  notificationScheduleId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.userCaloriesPlans, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => NotificationScheduleEntity, (schedule) => schedule.userCaloriesPlans, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'notification_schedule_id' })
  notificationSchedule: NotificationScheduleEntity;
}
