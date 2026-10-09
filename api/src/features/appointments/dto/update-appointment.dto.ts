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
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAppointmentDto {
  @ApiPropertyOptional({
    description: 'Identificador del profesional de salud',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  healthcareWorkerId?: string;

  @ApiPropertyOptional({
    description: 'Fecha y hora de la cita (ISO 8601)',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  dateHour?: string;

  @ApiPropertyOptional({ description: 'Motivo de la cita', maxLength: 255 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  reason?: string;

  @ApiPropertyOptional({
    description: 'Identificador del tipo de cita (catálogo)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  appointmentTypeId?: number;

  @ApiPropertyOptional({ description: 'Duración en minutos', minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  durationMinutes?: number;
}
