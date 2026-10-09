import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMedicalRecordDto {
  @ApiProperty({ description: 'Diagnóstico principal' })
  @IsString()
  @IsNotEmpty()
  primaryDiagnosis!: string;

  @ApiProperty({ description: 'Historia médica del paciente' })
  @IsString()
  @IsNotEmpty()
  medicalHistory!: string;

  @ApiProperty({ description: 'Alergias conocidas' })
  @IsString()
  @IsNotEmpty()
  allergies!: string;

  @ApiPropertyOptional({
    description: 'Grupo sanguíneo',
    maxLength: 10,
    example: 'O+',
  })
  @IsOptional()
  @IsString()
  @Length(1, 10)
  bloodType?: string;
}
