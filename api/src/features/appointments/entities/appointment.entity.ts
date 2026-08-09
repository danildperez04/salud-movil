import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Patient } from '../../users/entities/patient.entity';
import { HealthcareWorker } from '../../users/entities/healthcare-worker.entity';
import { AppointmentState } from '../../catalogues/entities/appointment-state.entity';
import { AppointmentType } from '../../catalogues/entities/appointment-type.entity';
import { User } from '../../users/entities/user.entity';
import { AppointmentReminder } from './appointment-reminder.entity';

@Entity('appointment')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'date_hour', type: 'timestamp' })
  dateHour!: Date;

  @Column({ length: 255 })
  reason!: string;

  @Column({ name: 'duration_minutes', nullable: true })
  durationMinutes!: number;

  @Column({ name: 'cancel_reason', length: 255, nullable: true })
  cancelReason!: string;

  @Column({ name: 'cancelled_at', type: 'timestamp', nullable: true })
  cancelledAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date | null;

  // === Relations ===

  @ManyToOne(() => Patient, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @ManyToOne(() => HealthcareWorker, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn({ name: 'healthcare_worker_id' })
  healthcareWorker!: HealthcareWorker;

  @ManyToOne(() => AppointmentState, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'appointment_state_id' })
  appointmentState!: AppointmentState;

  @ManyToOne(() => AppointmentType, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'appointment_type_id' })
  appointmentType!: AppointmentType;

  @ManyToOne(() => User, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy!: User;

  @OneToMany(() => AppointmentReminder, (reminder) => reminder.appointment, {
    cascade: ['soft-remove'],
  })
  reminders!: AppointmentReminder[];
}
