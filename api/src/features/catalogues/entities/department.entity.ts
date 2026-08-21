import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Municipality } from './municipality.entity';

@Entity('cat_department')
export class Department {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @OneToMany(() => Municipality, (municipality) => municipality.department)
  municipalities!: Municipality[];
}
