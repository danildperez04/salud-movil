import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePatientDto {
  @ApiPropertyOptional({ description: 'Nombre completo' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Correo electrónico', format: 'email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description:
      'Nombre de usuario (letras, números, punto, guion o guion bajo)',
    minLength: 3,
    maxLength: 50,
    pattern: '^[a-zA-Z0-9_.-]+$',
  })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  @Matches(/^[a-zA-Z0-9_.-]+$/, {
    message: 'El nombre de usuario solo puede contener letras, números, . _ -',
  })
  username?: string;

  @ApiPropertyOptional({
    description: 'Nueva contraseña',
    minLength: 8,
    format: 'password',
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiPropertyOptional({ description: 'Teléfono de contacto' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Dirección residencial' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Cédula de identidad', nullable: true })
  @IsOptional()
  @IsString()
  dni?: string;

  @ApiPropertyOptional({
    description: 'Identificador del municipio',
    example: 76,
  })
  @IsOptional()
  municipalityId?: number;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento (YYYY-MM-DD)',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: 'Identificador del género (catálogo)',
    example: 1,
  })
  @IsOptional()
  genreId?: number;

  @ApiPropertyOptional({ description: 'Nombre del contacto de emergencia' })
  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @ApiPropertyOptional({ description: 'Teléfono del contacto de emergencia' })
  @IsOptional()
  @IsString()
  emergencyContactPhoneNumber?: string;

  /** Reasignar centro de salud. Solo el administrador; el personal no puede. */
  @ApiPropertyOptional({
    description: 'Reasignar centro de salud',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  healthCenterId?: string;
}
