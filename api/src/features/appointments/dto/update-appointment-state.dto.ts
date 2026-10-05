import { IsIn } from 'class-validator';

export class UpdateAppointmentStateDto {
  @IsIn(['Completed', 'No show'])
  state!: 'Completed' | 'No show';
}
