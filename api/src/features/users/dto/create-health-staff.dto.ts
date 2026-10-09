import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHealthStaffDto {
  @ApiProperty({ description: 'Nombre completo del profesional de salud' })
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

  @ApiProperty({ description: 'Número de licencia profesional' })
  @IsString()
  @IsNotEmpty()
  licenseNumber!: string;

  @ApiProperty({ description: 'Número de empleado / legajo' })
  @IsString()
  @IsNotEmpty()
  employeeId!: string;

  @ApiProperty({
    description: 'Identificador de la especialidad médica (major)',
    example: 1,
  })
  @IsNotEmpty()
  majorId!: number;

  @ApiProperty({
    description: 'Identificador del centro de salud de pertenencia',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsString()
  @IsNotEmpty()
  healthCenterId!: string;
}
