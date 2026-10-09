import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiPropertyOptional({
    description:
      'Identificador del profesional de salud (opcional, se asigna automáticamente si no se indica)',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  healthcareWorkerId?: string;

  @ApiProperty({
    description: 'Fecha y hora de la cita (ISO 8601)',
    format: 'date-time',
  })
  @IsDateString()
  dateHour!: string;

  @ApiProperty({
    description: 'Motivo de la cita',
    maxLength: 255,
    example: 'Control de rutina',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  reason!: string;

  @ApiProperty({
    description: 'Identificador del tipo de cita (catálogo)',
    example: 1,
  })
  @IsInt()
  appointmentTypeId!: number;

  @ApiPropertyOptional({
    description: 'Duración en minutos',
    minimum: 1,
    default: 30,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  durationMinutes?: number;
}
