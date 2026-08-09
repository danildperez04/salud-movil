import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Patient } from '../../users/entities/patient.entity';
import { MedicalVisit } from './medical-visit.entity';
import { User } from '../../users/entities/user.entity';

@Entity('medical_record')
export class MedicalRecord {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'primary_diagnosis', length: 255 })
  primaryDiagnosis!: string;

  @Column({ name: 'medical_history', type: 'text' })
  medicalHistory!: string;

  @Column({ type: 'text' })
  allergies!: string;

  @Column({ name: 'blood_type', length: 10, nullable: true })
  bloodType!: string;

  @CreateDateColumn({ name: 'create_date' })
  createDate!: Date;

  @UpdateDateColumn({ name: 'update_date' })
  updateDate!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date | null;

  // === Relations ===

  @OneToOne(() => Patient, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @ManyToOne(() => User, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy!: User;

  @OneToMany(() => MedicalVisit, (visit) => visit.medicalRecord, {
    cascade: ['soft-remove'],
  })
  visits!: MedicalVisit[];
}
