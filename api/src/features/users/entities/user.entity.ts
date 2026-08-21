import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../catalogues/entities/role.entity';
import { Municipality } from '../../catalogues/entities/municipality.entity';
import { Patient } from './patient.entity';
import { Caregiver } from './caregiver.entity';
import { HealthcareWorker } from './healthcare-worker.entity';
import { PasswordReset } from '../../auth/entities/password-reset.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true, unique: true })
  dni!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ name: 'password_hash' })
  passwordHash!: string;

  @Column({ name: 'phone_number' })
  phoneNumber!: string;

  @Column()
  address!: string;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @Column({ name: 'signup_date', default: () => 'CURRENT_TIMESTAMP' })
  signupDate!: Date;

  @Column({ name: 'email_verified_at', type: 'timestamp', nullable: true })
  emailVerifiedAt!: Date | null;

  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date | null;

  // === Relations ===

  @ManyToOne(() => Role, (role) => role.users, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @ManyToOne(() => Municipality, (municipality) => municipality.users, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'municipality_id' })
  municipality!: Municipality;

  // === Inverse relations (soft-delete cascade) ===

  @OneToOne(() => Patient, (patient) => patient.user, {
    cascade: ['soft-remove'],
  })
  patient!: Patient;

  @OneToOne(() => Caregiver, (caregiver) => caregiver.user, {
    cascade: ['soft-remove'],
  })
  caregiver!: Caregiver;

  @OneToOne(() => HealthcareWorker, (worker) => worker.user, {
    cascade: ['soft-remove'],
  })
  healthcareWorker!: HealthcareWorker;

  @OneToMany(() => PasswordReset, (reset) => reset.user)
  passwordResets!: PasswordReset[];
}
