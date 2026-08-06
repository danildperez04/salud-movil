import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MedicationSchedule } from './medication-schedule.entity';
import { NotificationState } from '../../catalogues/entities/notification-state.entity';

@Entity('medication_reminder')
export class MedicationReminder {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'date_hour_scheduled', type: 'timestamp' })
  dateHourScheduled!: Date;

  @Column({ name: 'confirmation_date', type: 'timestamp', nullable: true })
  confirmationDate!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => MedicationSchedule)
  @JoinColumn({ name: 'schedule_id' })
  schedule!: MedicationSchedule;

  @ManyToOne(() => NotificationState)
  @JoinColumn({ name: 'notification_state_id' })
  notificationState!: NotificationState;
}
