import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { DemoRequestStatus } from '../demo-request-status';

/** Solicitud de demostración enviada desde el formulario público de la landing. */
@Entity('demo_request')
@Index('IDX_demo_request_status_created_at', ['status', 'createdAt'])
export class DemoRequest {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_demo_request',
  })
  id!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'varchar', length: 160 })
  email!: string;

  @Column({ type: 'varchar', length: 160 })
  organization!: string;

  /** Cargo de quien solicita (médico, director, coordinador…). */
  @Column({ name: 'job_title', type: 'varchar', length: 120, nullable: true })
  jobTitle!: string | null;

  @Column({ name: 'phone_number', type: 'varchar', length: 30, nullable: true })
  phoneNumber!: string | null;

  @Column({ type: 'text', nullable: true })
  message!: string | null;

  @Column({ type: 'varchar', length: 12, default: 'pending' })
  status!: DemoRequestStatus;

  /** Notas internas del equipo; nunca se exponen en el endpoint público. */
  @Column({ name: 'admin_notes', type: 'text', nullable: true })
  adminNotes!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
