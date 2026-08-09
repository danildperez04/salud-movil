import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('cat_role')
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  name!: string;

  @Column({ length: 20, unique: true })
  code!: string;

  @OneToMany(() => User, (user) => user.role)
  users!: User[];
}
