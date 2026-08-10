import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMedicalVisitDto {
  @IsOptional()
  @IsDateString()
  visitDate?: string;

  @IsString()
  @IsNotEmpty()
  diagnosis!: string;

  @IsString()
  @IsNotEmpty()
  observations!: string;

  @IsString()
  @IsNotEmpty()
  treatment!: string;

  @IsOptional()
  @IsDateString()
  nextVisitDate?: string;
}
