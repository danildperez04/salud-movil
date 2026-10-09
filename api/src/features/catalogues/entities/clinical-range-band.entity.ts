import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClinicalRange } from './clinical-range.entity';

export type BandSeverity = 'normal' | 'alert' | 'critical';
export type BandValueKind = 'primary' | 'secondary';

@Index(['clinicalRangeId', 'valueKind', 'sequence'], { unique: true })
@Entity('clinical_range_band')
export class ClinicalRangeBand {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'clinical_range_id' })
  clinicalRangeId!: number;

  /** Orden de evaluación ascendente. La primera banda cuyo intervalo contiene
   * el valor es la que gana. */
  @Column()
  sequence!: number;

  @Column({ length: 16 })
  severity!: BandSeverity;

  /** `primary` es el valor principal del indicador; `secondary` el secundario
   * (la diastólica en presión arterial). */
  @Column({ name: 'value_kind', length: 16, default: 'primary' })
  valueKind!: BandValueKind;

  /** Nulo = extremo abierto en esa dirección. */
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

  @Column({ length: 64 })
  label!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  // === Relations ===

  @ManyToOne(() => ClinicalRange, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'clinical_range_id' })
  clinicalRange!: ClinicalRange;
}
