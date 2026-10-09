import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { ReleasePlatform } from '../release-platform';

/**
 * Una versión instalable de la app para una plataforma. La "última" de cada
 * plataforma es la publicada más reciente: no hay un campo `latest` que pueda
 * quedar desincronizado.
 */
@Entity('app_release')
@Index('UQ_app_release_platform_version', ['platform', 'version'], {
  unique: true,
})
export class AppRelease {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'PK_app_release',
  })
  id!: string;

  @Column({ type: 'varchar', length: 10 })
  platform!: ReleasePlatform;

  @Column({ type: 'varchar', length: 40 })
  version!: string;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  /** Clave en el `ReleaseStorage`; no es el nombre con el que se descarga. */
  @Column({ name: 'file_key', type: 'varchar', length: 60 })
  fileKey!: string;

  /** Nombre con el que el navegador guarda el archivo. */
  @Column({ name: 'file_name', type: 'varchar', length: 120 })
  fileName!: string;

  // `bigint` llega como string desde pg; el transformer lo devuelve como número
  // (un instalable de menos de 9 PB cabe sin pérdida en un double).
  @Column({
    name: 'size_bytes',
    type: 'bigint',
    transformer: {
      to: (value: number) => value,
      from: (value: string | null) => (value === null ? null : Number(value)),
    },
  })
  sizeBytes!: number;

  @Column({ type: 'char', length: 64 })
  sha256!: string;

  @Column({ name: 'is_published', type: 'boolean', default: true })
  isPublished!: boolean;

  @Column({ name: 'download_count', type: 'int', default: 0 })
  downloadCount!: number;

  /** Id del admin que la subió. Sin FK: el historial sobrevive a la baja del usuario. */
  @Column({ name: 'uploaded_by', type: 'uuid', nullable: true })
  uploadedBy!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
