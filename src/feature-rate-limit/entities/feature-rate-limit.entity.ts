import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('feature_rate_limit')
export class FeatureRateLimitEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'key', type: 'varchar', nullable: false })
  key: string;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  description: string | null;

  @Column({ name: 'usage_per_day', type: 'int', nullable: false, default: 0 })
  usagePerDay: number;

  @Column({ name: 'max_per_day', type: 'int', nullable: false })
  maxPerDay: number;

  @Column({ name: 'last_reset_date', type: 'date', nullable: false })
  lastResetDate: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
