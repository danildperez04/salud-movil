import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHealthIndicatorDto {
  @ApiProperty({
    description: 'Identificador del tipo de indicador (catálogo)',
    example: 1,
  })
  @IsInt()
  typeIndicatorId!: number;

  @ApiProperty({
    description: 'Valor principal del indicador',
    minimum: 0.01,
    example: 120,
  })
  @IsNumber()
  @Min(0.01)
  value!: number;

  @ApiPropertyOptional({
    description: 'Valor secundario (p.ej. diastólica en presión arterial)',
    minimum: 0.01,
    example: 80,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  valueSecondary?: number;

  @ApiPropertyOptional({
    description: 'Fecha y hora del registro (ISO 8601)',
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  dateHour?: string;

  @ApiPropertyOptional({
    description: 'Notas libres del paciente o profesional',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  notes?: string;
}
