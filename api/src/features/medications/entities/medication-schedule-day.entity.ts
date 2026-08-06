import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MedicationSchedule } from './medication-schedule.entity';

@Entity('medication_schedule_day')
export class MedicationScheduleDay {
  @PrimaryColumn({ name: 'schedule_id', type: 'uuid' })
  scheduleId!: string;

  @PrimaryColumn({ name: 'week_day' })
  weekDay!: number;

  @ManyToOne(() => MedicationSchedule, (schedule) => schedule.days)
  @JoinColumn({ name: 'schedule_id' })
  schedule!: MedicationSchedule;
}
