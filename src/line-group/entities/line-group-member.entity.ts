import { UserEntity } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LineGroupEntity } from './line-groups.entity';

@Entity('line_group_member')
export class LineGroupMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'line_group_id', type: 'varchar', nullable: false })
  lineGroupId: string;

  @Column({ name: 'line_user_id', type: 'varchar', nullable: false })
  lineUserId: string;

  @Column({ name: 'join_group_at', type: 'timestamp', nullable: false })
  joinGroupAt: Date;

  @Column({ name: 'leave_group_at', type: 'timestamp', nullable: true })
  leaveGroupAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.lineGroupMembers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'line_user_id', referencedColumnName: 'lineUserId' })
  user: UserEntity;

  @ManyToOne(() => LineGroupEntity, (group) => group.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'line_group_id', referencedColumnName: 'lineGroupId' })
  group: LineGroupEntity;
}
