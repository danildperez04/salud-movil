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
} from 'class-validator';
import { CreateMedicationScheduleDto } from './create-medication.dto';

export class UpdateMedicationDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  drugName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  dose?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  instructions?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsInt()
  routeAdministrationId?: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  schedules?: CreateMedicationScheduleDto[];
}
