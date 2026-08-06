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
import { HealthcareWorker } from '../../users/entities/healthcare-worker.entity';
import { AppointmentState } from '../../catalogues/entities/appointment-state.entity';
import { AppointmentType } from '../../catalogues/entities/appointment-type.entity';
import { User } from '../../users/entities/user.entity';
import { AppointmentReminder } from './appointment-reminder.entity';

@Entity('appointment')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'patient_id', type: 'uuid' })
  patientId!: string;

  @Column({ name: 'healthcare_worker_id', type: 'uuid' })
  healthcareWorkerId!: string;

  @Column({ name: 'date_hour', type: 'timestamp' })
  dateHour!: Date;

  @Column({ length: 255 })
  reason!: string;

  @Column({ name: 'appointment_state_id' })
  appointmentStateId!: number;

  @Column({ name: 'appointment_type_id' })
  appointmentTypeId!: number;

  @Column({ name: 'duration_minutes', nullable: true })
  durationMinutes!: number;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy!: string | null;

  @Column({ name: 'cancel_reason', length: 255, nullable: true })
  cancelReason!: string;

  @Column({ name: 'cancelled_at', type: 'timestamp', nullable: true })
  cancelledAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @ManyToOne(() => HealthcareWorker)
  @JoinColumn({ name: 'healthcare_worker_id' })
  healthcareWorker!: HealthcareWorker;

  @ManyToOne(() => AppointmentState)
  @JoinColumn({ name: 'appointment_state_id' })
  appointmentState!: AppointmentState;

  @ManyToOne(() => AppointmentType)
  @JoinColumn({ name: 'appointment_type_id' })
  appointmentType!: AppointmentType;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdByUser!: User;

  @OneToMany(() => AppointmentReminder, (reminder) => reminder.appointment)
  reminders!: AppointmentReminder[];
}
