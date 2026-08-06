import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cat_major')
export class Major {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;
}
