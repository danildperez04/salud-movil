import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMedicalVisitDto {
  @ApiPropertyOptional({
    description: 'Fecha de la visita (YYYY-MM-DD)',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  visitDate?: string;

  @ApiProperty({ description: 'Diagnóstico de la visita' })
  @IsString()
  @IsNotEmpty()
  diagnosis!: string;

  @ApiProperty({ description: 'Observaciones de la visita' })
  @IsString()
  @IsNotEmpty()
  observations!: string;

  @ApiProperty({ description: 'Tratamiento indicado' })
  @IsString()
  @IsNotEmpty()
  treatment!: string;

  @ApiPropertyOptional({
    description: 'Fecha de próxima visita (YYYY-MM-DD)',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  nextVisitDate?: string;
}
