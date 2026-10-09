import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateHealthIndicatorDto {
  @ApiPropertyOptional({
    description: 'Identificador del tipo de indicador (catálogo)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  typeIndicatorId?: number;

  @ApiPropertyOptional({
    description: 'Valor principal',
    minimum: 0.01,
    example: 120,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  value?: number;

  @ApiPropertyOptional({
    description: 'Valor secundario (p.ej. diastólica)',
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

  @ApiPropertyOptional({ description: 'Notas libres' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  notes?: string;
}
