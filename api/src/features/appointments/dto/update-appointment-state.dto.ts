import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAppointmentStateDto {
  @ApiProperty({
    description: 'Nuevo estado de la cita',
    enum: ['Completed', 'No show'],
    example: 'Completed',
  })
  @IsIn(['Completed', 'No show'])
  state!: 'Completed' | 'No show';
}
