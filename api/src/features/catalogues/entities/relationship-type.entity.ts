import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cat_relationship_type')
export class RelationshipType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  name!: string;
}
