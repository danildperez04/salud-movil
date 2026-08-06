import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Genre } from '../../catalogues/entities/genre.entity';
import { HealthCenter } from '../../health-centers/entities/health-center.entity';

@Entity('patient')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth!: Date;

  @Column({ name: 'emergency_contact_name' })
  emergencyContactName!: string;

  @Column({ name: 'emergency_contact_phone_number' })
  emergencyContactPhoneNumber!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // === Relations ===

  @OneToOne(() => User)
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  user!: User;

  @ManyToOne(() => Genre)
  @JoinColumn({ name: 'genre_id' })
  genre!: Genre;

  @ManyToOne(() => HealthCenter, (healthCenter) => healthCenter.patients)
  @JoinColumn({ name: 'health_center_id' })
  healthCenter!: HealthCenter;
}
