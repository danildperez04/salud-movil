import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Municipality } from '../../catalogues/entities/municipality.entity';
import { HealthCenterType } from '../../catalogues/entities/health-center-type.entity';
import { HealthcareWorker } from '../../users/entities/healthcare-worker.entity';
import { Patient } from '../../users/entities/patient.entity';

@Entity('health_center')
export class HealthCenter {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  address!: string;

  @Column({ name: 'phone_number' })
  phoneNumber!: string;

  @Column({ name: 'health_center_type_id' })
  healthCenterTypeId!: number;

  @Column({ name: 'municipality_id' })
  municipalityId!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => HealthCenterType)
  @JoinColumn({ name: 'health_center_type_id' })
  healthCenterType!: HealthCenterType;

  @ManyToOne(() => Municipality)
  @JoinColumn({ name: 'municipality_id' })
  municipality!: Municipality;

  @OneToMany(() => HealthcareWorker, (worker) => worker.healthCenter)
  healthcareWorkers!: HealthcareWorker[];

  @OneToMany(() => Patient, (patient) => patient.healthCenter)
  patients!: Patient[];
}
