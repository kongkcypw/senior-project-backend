import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('feature_flag')
export class FeatureFlagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'key', type: 'varchar', nullable: false })
  key: string;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  description: string | null;

  @Column({ name: 'is_enable', type: 'boolean', nullable: false, default: false })
  isEnable: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
