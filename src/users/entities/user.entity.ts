import { LineGroupChatHistoryEntity } from 'src/line-group/entities/line-group-chat-history.entity';
import { LineGroupMemberEntity } from 'src/line-group/entities/line-group-member.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { MealHistoryEntity } from '../../nutrition/entities/meal-history.entity';
import { NutritionPlanEntity } from '../../nutrition/entities/nutrition-plan.entity';
import { UserPhysiqueHistoryEntity } from './user-physique-history.entity';
import { UserRelationshipEntity } from './user-relationships.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'line_user_id', type: 'varchar', unique: true, nullable: false })
  lineUserId: string;

  @Column({ name: 'display_name', type: 'varchar', nullable: true })
  displayName: string | null;

  @Column({ name: 'role', type: 'varchar', nullable: true })
  role: string | null;

  @Column({ name: 'picture_url', type: 'varchar', nullable: true })
  pictureUrl: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => LineGroupMemberEntity, (member) => member.user)
  lineGroupMembers?: LineGroupMemberEntity[];

  @OneToMany(() => LineGroupChatHistoryEntity, (chat) => chat.user)
  lineGroupChatHistory?: LineGroupChatHistoryEntity[];

  @OneToMany(() => MealHistoryEntity, (meal) => meal.user)
  mealHistory?: MealHistoryEntity[];

  @OneToMany(() => NutritionPlanEntity, (plan) => plan.user)
  nutritionPlan?: NutritionPlanEntity[];

  @OneToMany(() => UserPhysiqueHistoryEntity, (physique) => physique.user)
  physiqueHistory?: UserPhysiqueHistoryEntity[];

  // Relationships where this user is the TRAINEE
  @OneToMany(() => UserRelationshipEntity, (relationship) => relationship.trainee)
  traineeRelationships?: UserRelationshipEntity[];

  // Relationships where this user is the TRAINER
  @OneToMany(() => UserRelationshipEntity, (relationship) => relationship.trainer)
  trainerRelationships?: UserRelationshipEntity[];
}
