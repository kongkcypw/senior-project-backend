import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('meal_history')
export class MealHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'line_user_id', type: 'varchar', nullable: false })
  lineUserId: string;

  @Column({ name: 'food_title', type: 'varchar', nullable: false })
  foodTitle: string;

  @Column({ name: 'image_url', type: 'varchar', nullable: false })
  imageUrl: string;

  @Column({ name: 'calories', type: 'integer', nullable: false })
  calories: number;

  @Column({ name: 'protein', type: 'integer', nullable: false })
  protein: number;

  @Column({ name: 'carbohydrate', type: 'integer', nullable: false })
  carbohydrate: number;

  @Column({ name: 'fat', type: 'integer', nullable: false })
  fat: number;

  @Column({ name: 'ingredients', type: 'jsonb', nullable: false })
  ingredients: any;

  @Column({ name: 'confirm_at', type: 'timestamp', nullable: true })
  confirmAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.mealHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'line_user_id', referencedColumnName: 'lineUserId' })
  user: UserEntity;
}
