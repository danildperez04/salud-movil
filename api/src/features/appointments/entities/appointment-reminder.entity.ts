import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date | null;

  // === Relations ===
  @ManyToOne(() => Appointment, (appointment) => appointment.reminders, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'appointment_id' })
  appointment!: Appointment;

  @ManyToOne(() => NotificationState, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn({ name: 'notification_state_id' })
  notificationState!: NotificationState;
}
