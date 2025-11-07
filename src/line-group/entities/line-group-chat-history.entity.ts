import { UserEntity } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LineGroupEntity } from './line-groups.entity';

@Entity('line_group_chat_history')
export class LineGroupChatHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'line_group_id', type: 'varchar', nullable: false })
  lineGroupId: string;

  @Column({ name: 'line_user_id', type: 'varchar', nullable: false })
  lineUserId: string;

  @Column({ name: 'message_id', type: 'integer', nullable: false })
  messageId: number;

  @Column({ name: 'sent_at', type: 'timestamp', nullable: false })
  sentAt: Date;

  @Column({ name: 'unsent_at', type: 'timestamp', nullable: true })
  unsentAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.lineGroupChatHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'line_user_id', referencedColumnName: 'lineUserId' })
  user: UserEntity;

  @ManyToOne(() => LineGroupEntity, (group) => group.chatHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'line_group_id', referencedColumnName: 'lineGroupId' })
  group: LineGroupEntity;
}
