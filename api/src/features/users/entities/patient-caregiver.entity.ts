import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Patient } from './patient.entity';
import { Caregiver } from './caregiver.entity';
import { RelationshipType } from '../../catalogues/entities/relationship-type.entity';

@Entity('patient_caregiver')
export class PatientCaregiver {
  @PrimaryColumn({ name: 'patient_id', type: 'uuid' })
  patientId!: string;

  @PrimaryColumn({ name: 'caregiver_id', type: 'uuid' })
  caregiverId!: string;

  @Column({ name: 'relationship_type_id' })
  relationshipTypeId!: number;

  @Column({ name: 'date_link', type: 'date', default: () => 'CURRENT_DATE' })
  dateLink!: Date;

  @Column({ name: 'is_primary', default: false })
  isPrimary!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @ManyToOne(() => Caregiver)
  @JoinColumn({ name: 'caregiver_id' })
  caregiver!: Caregiver;

  @ManyToOne(() => RelationshipType)
  @JoinColumn({ name: 'relationship_type_id' })
  relationshipType!: RelationshipType;
}
