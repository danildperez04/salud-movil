import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { User } from '../../users/entities/user.entity';

@Entity('cat_municipality')
export class Municipality {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @ManyToOne(() => Department, (department) => department.municipalities, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'department_id' })
  department!: Department;

  @OneToMany(() => User, (user) => user.municipality)
  users!: User[];
}
