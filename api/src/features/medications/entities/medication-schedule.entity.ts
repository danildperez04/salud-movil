import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Medication } from './medication.entity';
import { MedicationScheduleDay } from './medication-schedule-day.entity';
import { MedicationReminder } from './medication-reminder.entity';

@Entity('medication_schedule')
export class MedicationSchedule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'time' })
  hour!: string;

  @Column({ name: 'times_per_day' })
  timesPerDay!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date | null;

  // === Relations ===

  @ManyToOne(() => Medication, (medication) => medication.schedules, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'medicine_id' })
  medication!: Medication;

  @OneToMany(() => MedicationScheduleDay, (day) => day.schedule, {
    cascade: ['soft-remove'],
  })
  days!: MedicationScheduleDay[];

  @OneToMany(() => MedicationReminder, (reminder) => reminder.schedule, {
    cascade: ['soft-remove'],
  })
  reminders!: MedicationReminder[];
}
