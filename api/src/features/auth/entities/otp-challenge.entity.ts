import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

/** Para qué se emitió el código: iniciar sesión o activar el 2FA. */
export type OtpPurpose = 'login' | 'enable';

/**
 * Código de un solo uso para la verificación en dos pasos. Solo se guarda el
 * hash SHA-256 del código. Hay como máximo una fila por (usuario, propósito):
 * emitir un código nuevo borra el anterior, y consumirlo borra la fila.
 */
@Entity('otp_challenge')
@Index(['userId', 'purpose'])
export class OtpChallenge {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @Column({ type: 'varchar', length: 20 })
  purpose!: OtpPurpose;

  @Column({ name: 'code_hash' })
  codeHash!: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt!: Date;

  /** Intentos de código ya gastados; al llegar al máximo el desafío muere. */
  @Column({ type: 'int', default: 0 })
  attempts!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
