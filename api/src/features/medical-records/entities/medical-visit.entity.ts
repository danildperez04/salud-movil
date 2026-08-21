import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MedicalRecord } from './medical-record.entity';
import { HealthcareWorker } from '../../users/entities/healthcare-worker.entity';

@Entity('medical_visit')
export class MedicalVisit {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'visit_date', type: 'timestamp' })
  visitDate!: Date;

  @Column({ length: 255 })
  diagnosis!: string;

  @Column({ type: 'text' })
  observations!: string;

  @Column({ type: 'text' })
  treatment!: string;

  @Column({ name: 'next_visit_date', type: 'date', nullable: true })
  nextVisitDate!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date | null;

  // === Relations ===

  @ManyToOne(() => MedicalRecord, (record) => record.visits, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'medical_record_id' })
  medicalRecord!: MedicalRecord;

  @ManyToOne(() => HealthcareWorker, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn({ name: 'healthcare_worker_id' })
  healthcareWorker!: HealthcareWorker;
}
