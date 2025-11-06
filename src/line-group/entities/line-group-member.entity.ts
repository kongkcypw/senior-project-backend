import { UserEntity } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LineGroupEntity } from './line-groups.entity';

@Entity('line_group_member')
export class LineGroupMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'group_id', type: 'varchar', nullable: false })
  groupId: string;

  @Column({ name: 'user_id', type: 'integer', nullable: false })
  userId: number;

  @Column({ name: 'join_group_at', type: 'timestamp', nullable: false })
  joinGroupAt: Date;

  @Column({ name: 'leave_group_at', type: 'timestamp', nullable: true })
  leaveGroupAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.lineGroupMembers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => LineGroupEntity, (group) => group.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id', referencedColumnName: 'groupId' })
  group: LineGroupEntity;
}
