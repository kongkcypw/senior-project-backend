import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user_calories')
export class UserCaloriesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'integer', nullable: false })
  userId: number;

  @Column({ name: 'food_title', type: 'varchar', nullable: false })
  foodTitle: string;

  @Column({ name: 'total_calories', type: 'integer', nullable: false })
  totalCalories: number;

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

  @ManyToOne(() => UserEntity, (user) => user.userCalories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
