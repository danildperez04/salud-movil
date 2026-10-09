import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Recorta espacios; deja pasar lo que no es texto para que lo rechace el validador. */
const trim = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

/** Un campo opcional vacío (`""`) llega del formulario como si no existiera. */
const trimOrUndefined = ({ value }: { value: unknown }): unknown => {
  const text = trim({ value });
  return text === '' ? undefined : text;
};

export class CreateDemoRequestDto {
  @ApiProperty({ description: 'Nombre completo', minLength: 2, maxLength: 120 })
  @Transform(trim)
  @IsString()
  @Length(2, 120)
  name!: string;

  @ApiProperty({
    description: 'Correo electrónico',
    format: 'email',
    maxLength: 160,
  })
  @Transform(trim)
  @IsEmail({}, { message: 'Ingresa un correo válido' })
  @MaxLength(160)
  email!: string;

  @ApiProperty({
    description: 'Organización o empresa',
    minLength: 2,
    maxLength: 160,
  })
  @Transform(trim)
  @IsString()
  @Length(2, 160)
  organization!: string;

  @ApiPropertyOptional({
    description: 'Cargo en la organización',
    maxLength: 120,
  })
  @IsOptional()
  @Transform(trimOrUndefined)
  @IsString()
  @MaxLength(120)
  jobTitle?: string;

  @ApiPropertyOptional({ description: 'Teléfono de contacto', maxLength: 28 })
  @IsOptional()
  @Transform(trimOrUndefined)
  @IsString()
  @Matches(/^[+\d][\d\s().-]{6,28}$/, {
    message: 'Ingresa un teléfono válido',
  })
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Mensaje o consulta', maxLength: 1000 })
  @IsOptional()
  @Transform(trimOrUndefined)
  @IsString()
  @MaxLength(1000)
  message?: string;

  /**
   * Señuelo anti-bots: el formulario lo oculta, así que una persona nunca lo
   * llena. Si llega con contenido se responde 201 igual pero no se guarda nada,
   * para que el bot no sepa que lo detectamos.
   */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  website?: string;
}
