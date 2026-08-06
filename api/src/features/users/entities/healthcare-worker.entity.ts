import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Major } from '../../catalogues/entities/major.entity';
import { HealthCenter } from '../../health-centers/entities/health-center.entity';

@Entity('healthcare_worker')
export class HealthcareWorker {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'major_id' })
  majorId!: number;

  @Column({ name: 'license_number' })
  licenseNumber!: string;

  @Column({ name: 'employee_id' })
  employeeId!: string;

  @Column({ name: 'health_center_id', type: 'uuid' })
  healthCenterId!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

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
