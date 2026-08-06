import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Medication } from './medication.entity';
import { MedicationScheduleDay } from './medication-schedule-day.entity';

@Entity('medication_schedule')
export class MedicationSchedule {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'medicine_id', type: 'uuid' })
  medicineId!: string;

  @Column({ type: 'time' })
  hour!: string;

  @Column({ name: 'times_per_day' })
  timesPerDay!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => Medication, (medication) => medication.schedules)
  @JoinColumn({ name: 'medicine_id' })
  medication!: Medication;

  @OneToMany(() => MedicationScheduleDay, (day) => day.schedule)
  days!: MedicationScheduleDay[];
}
