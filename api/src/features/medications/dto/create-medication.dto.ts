import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMedicationScheduleDto {
  @ApiProperty({
    description: 'Hora de la toma (formato HH:mm, 24h)',
    pattern: '^([01]\\d|2[0-3]):[0-5]\\d$',
    example: '08:00',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'hour debe tener formato HH:mm',
  })
  hour!: string;

  @ApiProperty({
    description: 'Veces al día (1-4)',
    minimum: 1,
    maximum: 4,
    example: 1,
  })
  @IsInt()
  @Min(1)
  @Max(4)
  timesPerDay!: number;

  @ApiProperty({
    description: 'Días de la semana (0=Domingo ... 6=Sábado), sin repetir',
    type: [Number],
    minItems: 1,
    maxItems: 7,
    uniqueItems: true,
    example: [1, 3, 5],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  days!: number[];
}

export class CreateMedicationDto {
  @ApiProperty({ description: 'Nombre del medicamento', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  drugName!: string;

  @ApiProperty({ description: 'Dosis', maxLength: 255, example: '500 mg' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  dose!: string;

  @ApiPropertyOptional({
    description: 'Instrucciones adicionales',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  instructions?: string;

  @ApiProperty({ description: 'Fecha de inicio (YYYY-MM-DD)', format: 'date' })
  @IsDateString()
  startDate!: string;

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
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({
    description: 'Identificador de la vía de administración (catálogo)',
    example: 1,
  })
  @IsInt()
  routeAdministrationId!: number;

  @ApiProperty({
    description: 'Horarios del medicamento (mínimo 1)',
    type: [CreateMedicationScheduleDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateMedicationScheduleDto)
  schedules!: CreateMedicationScheduleDto[];
}
