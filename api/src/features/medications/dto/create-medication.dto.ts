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
} from 'class-validator';

export class CreateMedicationScheduleDto {
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'hour debe tener formato HH:mm',
  })
  hour!: string;

  @IsInt()
  @Min(1)
  @Max(4)
  timesPerDay!: number;

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
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  drugName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  dose!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  instructions?: string;

  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsInt()
  routeAdministrationId!: number;

  @IsArray()
  @ArrayMinSize(1)
  schedules!: CreateMedicationScheduleDto[];
}
