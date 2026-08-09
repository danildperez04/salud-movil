import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { PatientCaregiver } from './patient-caregiver.entity';

@Entity('caregiver')
export class Caregiver {
  @PrimaryColumn('uuid')
  id!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date | null;

  // === Relations ===

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  user!: User;

  // === Inverse relations (soft-delete cascade) ===

  @OneToMany(() => PatientCaregiver, (link) => link.caregiver, {
    cascade: ['soft-remove'],
  })
  caregiverLinks!: PatientCaregiver[];
}
