import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cat_major')
export class Major {
  @PrimaryGeneratedColumn()
  id!: number;

  // Único: es la identidad lógica del catálogo y lo que hace idempotente
  // el sembrado (`ON CONFLICT (name) DO NOTHING`).
  @Column({ length: 100, unique: true })
  name!: string;
}
