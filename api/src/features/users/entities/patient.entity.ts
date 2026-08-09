import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Genre } from '../../catalogues/entities/genre.entity';
import { HealthCenter } from '../../health-centers/entities/health-center.entity';
import { MedicalRecord } from '../../medical-records/entities/medical-record.entity';
import { HealthIndicator } from '../../health-indicators/entities/health-indicator.entity';
import { Medication } from '../../medications/entities/medication.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { PatientCaregiver } from './patient-caregiver.entity';

@Entity('patient')
export class Patient {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth!: Date;

  @Column({ name: 'emergency_contact_name' })
  emergencyContactName!: string;

  @Column({ name: 'emergency_contact_phone_number' })
  emergencyContactPhoneNumber!: string;

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

  @ManyToOne(() => Genre, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn({ name: 'genre_id' })
  genre!: Genre;

  @ManyToOne(() => HealthCenter, (healthCenter) => healthCenter.patients, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'health_center_id' })
  healthCenter!: HealthCenter;

  // === Inverse relations (soft-delete cascade) ===

  @OneToOne(() => MedicalRecord, (record) => record.patient, {
    cascade: ['soft-remove'],
  })
  medicalRecord!: MedicalRecord;

  @OneToMany(() => HealthIndicator, (indicator) => indicator.patient, {
    cascade: ['soft-remove'],
  })
  healthIndicators!: HealthIndicator[];

  @OneToMany(() => Medication, (medication) => medication.patient, {
    cascade: ['soft-remove'],
  })
  medications!: Medication[];

  @OneToMany(() => Appointment, (appointment) => appointment.patient, {
    cascade: ['soft-remove'],
  })
  appointments!: Appointment[];

  @OneToMany(() => PatientCaregiver, (link) => link.patient, {
    cascade: ['soft-remove'],
  })
  patientLinks!: PatientCaregiver[];
}
