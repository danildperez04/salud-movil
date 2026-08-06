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
import { Patient } from '../../users/entities/patient.entity';
import { MedicalVisit } from './medical-visit.entity';

@Entity('medical_record')
export class MedicalRecord {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'patient_id', type: 'uuid', unique: true })
  patientId!: string;

  @Column({ name: 'primary_diagnosis' })
  primaryDiagnosis!: string;

  @Column({ name: 'medical_history', type: 'text' })
  medicalHistory!: string;

  @Column({ type: 'text' })
  allergies!: string;

  @Column({ name: 'blood_type', length: 10, nullable: true })
  bloodType!: string;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy!: string | null;

  @CreateDateColumn({ name: 'create_date' })
  createDate!: Date;

  @UpdateDateColumn({ name: 'update_date' })
  updateDate!: Date;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @OneToMany(() => MedicalVisit, (visit) => visit.medicalRecord)
  visits!: MedicalVisit[];
}
