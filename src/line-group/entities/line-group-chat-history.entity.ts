import { UserEntity } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LineGroupEntity } from './line-groups.entity';

@Entity('line_group_chat_history')
export class LineGroupChatHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'group_id', type: 'varchar', nullable: false })
  groupId: string;

  @Column({ name: 'user_id', type: 'integer', nullable: false })
  userId: number;

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
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => LineGroupEntity, (group) => group.chatHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id', referencedColumnName: 'groupId' })
  group: LineGroupEntity;
}
