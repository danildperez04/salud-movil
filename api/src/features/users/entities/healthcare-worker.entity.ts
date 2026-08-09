import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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

  @Column({ name: 'license_number' })
  licenseNumber!: string;

  @Column({ name: 'employee_id' })
  employeeId!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date | null;

  // === Relations ===

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  user!: User;

  @ManyToOne(() => Major, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn({ name: 'major_id' })
  major!: Major;

  @ManyToOne(
    () => HealthCenter,
    (healthCenter) => healthCenter.healthcareWorkers,
    { onDelete: 'RESTRICT', nullable: false },
  )
  @JoinColumn({ name: 'health_center_id' })
  healthCenter!: HealthCenter;
}
