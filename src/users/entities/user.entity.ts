import { LineGroupChatHistoryEntity } from 'src/line-group/entities/line-group-chat-history.entity';
import { LineGroupMemberEntity } from 'src/line-group/entities/line-group-member.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserCaloriesEntity } from './user-calories.entity';
import { UserCaloriesPlanEntity } from './user-calories-plan.entity';

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

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => LineGroupMemberEntity, (member) => member.user)
  lineGroupMembers?: LineGroupMemberEntity[];

  @OneToMany(() => LineGroupChatHistoryEntity, (chat) => chat.user)
  lineGroupChatHistory?: LineGroupChatHistoryEntity[];

  @OneToMany(() => UserCaloriesEntity, (calories) => calories.user)
  userCalories?: UserCaloriesEntity[];

  @OneToMany(() => UserCaloriesPlanEntity, (plan) => plan.user)
  userCaloriesPlans?: UserCaloriesPlanEntity[];
}
