import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { LineGroupMemberEntity } from './line-group-member.entity';
import { LineGroupChatHistoryEntity } from './line-group-chat-history.entity';

@Entity('line_group')
export class LineGroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'group_id', type: 'varchar', unique: true, nullable: false })
  groupId: string;

  @Column({ name: 'name', type: 'varchar', unique: true, nullable: true })
  name: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => LineGroupMemberEntity, (member) => member.group)
  members?: LineGroupMemberEntity[];

  @OneToMany(() => LineGroupChatHistoryEntity, (chat) => chat.group)
  chatHistory?: LineGroupChatHistoryEntity[];
}
