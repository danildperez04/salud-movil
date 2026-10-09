import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Municipality } from './municipality.entity';

@Entity('cat_department')
export class Department {
  @PrimaryGeneratedColumn()
  id!: number;

  // Único: los municipios se resuelven por nombre de departamento al sembrar.
  @Column({ length: 100, unique: true })
  name!: string;

  @OneToMany(() => Municipality, (municipality) => municipality.department)
  municipalities!: Municipality[];
}
