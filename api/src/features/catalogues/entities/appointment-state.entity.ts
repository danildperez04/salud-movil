import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cat_appointment_state')
export class AppointmentState {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  name!: string;
}
