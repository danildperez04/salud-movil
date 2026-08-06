import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MedicationSchedule } from './medication-schedule.entity';

@Entity('medication_schedule_day')
export class MedicationScheduleDay {
  @PrimaryGeneratedColumn()
  id!: string;

  @PrimaryColumn({ name: 'week_day' })
  weekDay!: number;

  // === Relations ===

  @ManyToOne(() => MedicationSchedule, (schedule) => schedule.days)
  @JoinColumn({ name: 'schedule_id' })
  schedule!: MedicationSchedule;
}
