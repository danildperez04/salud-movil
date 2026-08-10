import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UpdateMedicalRecordDto {
  @IsString()
  @IsNotEmpty()
  primaryDiagnosis!: string;

  @IsString()
  @IsNotEmpty()
  medicalHistory!: string;

  @IsString()
  @IsNotEmpty()
  allergies!: string;

  @IsOptional()
  @IsString()
  @Length(1, 10)
  bloodType?: string;
}
