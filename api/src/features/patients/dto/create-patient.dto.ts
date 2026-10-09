import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiProperty({ description: 'Nombre completo del paciente' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Correo electrónico', format: 'email' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description:
      'Nombre de usuario (letras, números, punto, guion o guion bajo)',
    minLength: 3,
    maxLength: 50,
    pattern: '^[a-zA-Z0-9_.-]+$',
  })
  @IsString()
  @Length(3, 50)
  @Matches(/^[a-zA-Z0-9_.-]+$/, {
    message: 'El nombre de usuario solo puede contener letras, números, . _ -',
  })
  username!: string;

  @ApiProperty({
    description: 'Contraseña de la cuenta',
    minLength: 8,
    format: 'password',
  })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ description: 'Teléfono de contacto' })
  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @ApiProperty({ description: 'Dirección residencial' })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiPropertyOptional({ description: 'Cédula de identidad', nullable: true })
  @IsOptional()
  @IsString()
  dni?: string;

  @ApiProperty({
    description: 'Identificador del municipio de residencia',
    example: 76,
  })
  @IsNotEmpty()
  municipalityId!: number;

  @ApiProperty({
    description: 'Fecha de nacimiento (YYYY-MM-DD)',
    format: 'date',
  })
  @IsDateString()
  dateOfBirth!: string;

  @ApiProperty({
    description: 'Identificador del género (catálogo)',
    example: 1,
  })
  @IsNotEmpty()
  genreId!: number;

  @ApiProperty({ description: 'Nombre del contacto de emergencia' })
  @IsString()
  @IsNotEmpty()
  emergencyContactName!: string;

  @ApiProperty({ description: 'Teléfono del contacto de emergencia' })
  @IsString()
  @IsNotEmpty()
  emergencyContactPhoneNumber!: string;

  @ApiPropertyOptional({
    description: 'Identificador del centro de salud asignado',
    format: 'uuid',
  })
  @IsOptional()
  @IsString()
  healthCenterId?: string;
}
