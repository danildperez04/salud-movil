import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cat_type_indicator')
export class TypeIndicator {
  @PrimaryGeneratedColumn()
  id!: number;

  // Único: la unidad acompaña al dato, pero no identifica el tipo de indicador.
  @Column({ length: 255, unique: true })
  name!: string;

  @Column({ name: 'measurement_unit', length: 255 })
  measurementUnit!: string;
}
