import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { NutritionNotificationTimeEntity } from './nutrition-notification-time.entity';

@Entity('nutrition_plan')
export class NutritionPlanEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'line_user_id', type: 'varchar', nullable: false })
  lineUserId: string;

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

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.nutritionPlan, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'line_user_id', referencedColumnName: 'lineUserId' })
  user: UserEntity;

  @OneToMany(() => NutritionNotificationTimeEntity, (time) => time.nutritionPlan)
  notificationTimes: NutritionNotificationTimeEntity[];
}
