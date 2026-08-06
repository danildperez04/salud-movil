import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cat_route_administration')
export class RouteAdministration {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  name!: string;
}
