import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cat_genre')
export class Genre {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  name!: string;
}
