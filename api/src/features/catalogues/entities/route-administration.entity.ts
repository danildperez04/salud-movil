import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cat_route_administration')
export class RouteAdministration {
  @PrimaryGeneratedColumn()
  id!: number;

  // Único: es la identidad lógica del catálogo y lo que hace idempotente
  // el sembrado (`ON CONFLICT (name) DO NOTHING`).
  @Column({ length: 50, unique: true })
  name!: string;
}
