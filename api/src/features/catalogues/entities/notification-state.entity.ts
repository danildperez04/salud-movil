import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cat_notification_state')
export class NotificationState {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50 })
  name!: string;
}
