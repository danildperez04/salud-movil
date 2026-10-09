import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RELEASE_PLATFORMS, type ReleasePlatform } from '../release-platform';

/** Convierte "true"/"false" (multipart solo manda strings) en booleano. */
export const toBoolean = ({ value }: { value: unknown }): unknown =>
  value === 'true' ? true : value === 'false' ? false : value;

/** Campos de texto del formulario multipart; el archivo llega aparte. */
export class CreateReleaseDto {
  @ApiProperty({
    description: 'Plataforma del instalador',
    enum: RELEASE_PLATFORMS,
    example: 'android',
  })
  @IsIn(RELEASE_PLATFORMS)
  platform!: ReleasePlatform;

  /** Semver con sufijo opcional: `1.4.0`, `1.4.0-beta.2`. */
  @ApiProperty({
    description: 'Versión semántica (p.ej. 1.2.3 o 1.2.3-beta.1)',
    pattern: '^\\d{1,4}\\.\\d{1,4}\\.\\d{1,4}(?:[-+][0-9A-Za-z.-]{1,20})?$',
    example: '1.4.0',
  })
  @IsString()
  @Matches(/^\d{1,4}\.\d{1,4}\.\d{1,4}(?:[-+][0-9A-Za-z.-]{1,20})?$/, {
    message: 'La versión debe tener el formato 1.2.3 (opcional: 1.2.3-beta.1)',
  })
  version!: string;

  @ApiPropertyOptional({
    description: 'Notas de la versión / changelog',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  /** Si se omite se publica de inmediato. */
  @ApiPropertyOptional({
    description: 'Publicar inmediatamente',
    type: Boolean,
    default: true,
  })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isPublished?: boolean;
}
