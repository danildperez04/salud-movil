import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CancelAppointmentDto {
  @ApiProperty({ description: 'Motivo de la cancelación', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  cancelReason!: string;
}
