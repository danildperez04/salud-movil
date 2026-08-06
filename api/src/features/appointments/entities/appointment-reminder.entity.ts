import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Appointment } from './appointment.entity';
import { NotificationState } from '../../catalogues/entities/notification-state.entity';

@Entity('appointment_reminder')
export class AppointmentReminder {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'date_hour_send', type: 'timestamp' })
  dateHourSend!: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  // === Relations ===
  @ManyToOne(() => Appointment, (appointment) => appointment.reminders)
  @JoinColumn({ name: 'appointment_id' })
  appointment!: Appointment;

  @ManyToOne(() => NotificationState)
  @JoinColumn({ name: 'notification_state_id' })
  notificationState!: NotificationState;
}
