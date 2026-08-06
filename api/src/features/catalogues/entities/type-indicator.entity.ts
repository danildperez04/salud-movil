import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cat_type_indicator')
export class TypeIndicator {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ name: 'measurement_unit', length: 255 })
  measurementUnit!: string;
}
