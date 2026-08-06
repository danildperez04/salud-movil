import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Major } from '../../catalogues/entities/major.entity';
import { HealthCenter } from '../../health-centers/entities/health-center.entity';

@Entity('healthcare_worker')
export class HealthcareWorker {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'license_number' })
  licenseNumber!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // === Relations ===

  @OneToOne(() => User)
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  user!: User;

  @ManyToOne(() => Major)
  @JoinColumn({ name: 'major_id' })
  major!: Major;

  @ManyToOne(
    () => HealthCenter,
    (healthCenter) => healthCenter.healthcareWorkers,
  )
  @JoinColumn({ name: 'health_center_id' })
  healthCenter!: HealthCenter;
}
