import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateHealthIndicatorDto {
  @IsInt()
  typeIndicatorId!: number;

  @IsNumber()
  @Min(0.01)
  value!: number;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  valueSecondary?: number;

  @IsOptional()
  @IsDateString()
  dateHour?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  notes?: string;
}
