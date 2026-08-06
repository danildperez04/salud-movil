import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cat_appointment_type')
export class AppointmentType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  name!: string;
}
