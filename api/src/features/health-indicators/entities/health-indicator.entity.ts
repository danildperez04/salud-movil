import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Patient } from '../../users/entities/patient.entity';
import { TypeIndicator } from '../../catalogues/entities/type-indicator.entity';
import { User } from '../../users/entities/user.entity';

@Entity('health_indicator')
export class HealthIndicator {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'type_indicator_id' })
  typeIndicatorId!: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  value!: string;

  @Column({
    name: 'value_secondary',
    type: 'decimal',
    precision: 8,
    scale: 2,
    nullable: true,
  })
  valueSecondary!: string | null;

  @Column({ name: 'date_hour', type: 'timestamp' })
  dateHour!: Date;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @ManyToOne(() => TypeIndicator)
  @JoinColumn({ name: 'type_indicator_id' })
  typeIndicator!: TypeIndicator;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'registered_by' })
  registeredByUser!: User;
}
