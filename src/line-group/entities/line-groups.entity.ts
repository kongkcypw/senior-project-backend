import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { LineGroupMemberEntity } from './line-group-member.entity';
import { LineGroupChatHistoryEntity } from './line-group-chat-history.entity';

@Entity('line_group')
export class LineGroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'line_group_id', type: 'varchar', unique: true, nullable: false })
  lineGroupId: string;

  @Column({ name: 'name', type: 'varchar', nullable: true })
  name: string | null;

  @Column({ name: 'picture_url', type: 'varchar', nullable: true })
  pictureUrl: string | null;

  @Column({ name: 'join_group_at', type: 'timestamp', nullable: false })
  joinGroupAt: Date;

  @Column({ name: 'leave_group_at', type: 'timestamp', nullable: true })
  leaveGroupAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => LineGroupMemberEntity, (member) => member.group)
  members?: LineGroupMemberEntity[];

  @OneToMany(() => LineGroupChatHistoryEntity, (chat) => chat.group)
  chatHistory?: LineGroupChatHistoryEntity[];
}
