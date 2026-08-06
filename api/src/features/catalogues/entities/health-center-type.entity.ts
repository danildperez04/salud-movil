import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cat_health_center_type')
export class HealthCenterType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  name!: string;
}
