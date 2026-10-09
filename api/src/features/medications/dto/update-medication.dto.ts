import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateMedicationScheduleDto } from './create-medication.dto';

export class UpdateMedicationDto {
  @ApiPropertyOptional({
    description: 'Nombre del medicamento',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  drugName?: string;

  @ApiPropertyOptional({ description: 'Dosis', maxLength: 255 })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  dose?: string;

  @ApiPropertyOptional({
    description: 'Instrucciones adicionales',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  instructions?: string;

  @ApiPropertyOptional({
    description: 'Fecha de inicio (YYYY-MM-DD)',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Fecha de fin (YYYY-MM-DD)',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Si el medicamento está activo',
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Identificador de la vía de administración (catálogo)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  routeAdministrationId?: number;

  @ApiPropertyOptional({
    description: 'Horarios del medicamento (mínimo 1)',
    type: [CreateMedicationScheduleDto],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateMedicationScheduleDto)
  schedules?: CreateMedicationScheduleDto[];
}
