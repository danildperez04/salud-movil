import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TypeIndicator } from './type-indicator.entity';

@Entity('clinical_range')
export class ClinicalRange {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'type_indicator_id', unique: true })
  typeIndicatorId!: number;

  @Column({
    name: 'min_value',
    type: 'decimal',
    precision: 8,
    scale: 2,
    nullable: true,
  })
  minValue!: string | null;

  @Column({
    name: 'max_value',
    type: 'decimal',
    precision: 8,
    scale: 2,
    nullable: true,
  })
  maxValue!: string | null;

  @Column({
    name: 'min_value_secondary',
    type: 'decimal',
    precision: 8,
    scale: 2,
    nullable: true,
  })
  minValueSecondary!: string | null;

  @Column({
    name: 'max_value_secondary',
    type: 'decimal',
    precision: 8,
    scale: 2,
    nullable: true,
  })
  maxValueSecondary!: string | null;

  // === Relations ===

  @ManyToOne(() => TypeIndicator, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn({ name: 'type_indicator_id' })
  typeIndicator!: TypeIndicator;
}
