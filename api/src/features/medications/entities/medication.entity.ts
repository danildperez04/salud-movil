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
import { RouteAdministration } from '../../catalogues/entities/route-administration.entity';
import { User } from '../../users/entities/user.entity';
import { MedicationSchedule } from './medication-schedule.entity';

@Entity('medication')
export class Medication {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'drug_name' })
  drugName!: string;

  @Column({ length: 255 })
  dose!: string;

  @Column({ length: 255, nullable: true })
  instructions!: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate!: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate!: Date | null;

  @Column({ default: true })
  active!: boolean;

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

  @ManyToOne(() => RouteAdministration, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'route_administration_id' })
  routeAdministration!: RouteAdministration;

  @ManyToOne(() => User, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'prescribed_by' })
  prescribedByUser!: User;

  @OneToMany(() => MedicationSchedule, (schedule) => schedule.medication, {
    cascade: ['soft-remove'],
  })
  schedules!: MedicationSchedule[];
}
