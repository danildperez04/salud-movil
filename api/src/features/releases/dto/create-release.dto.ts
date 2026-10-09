import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { RELEASE_PLATFORMS, type ReleasePlatform } from '../release-platform';

/** Convierte "true"/"false" (multipart solo manda strings) en booleano. */
export const toBoolean = ({ value }: { value: unknown }): unknown =>
  value === 'true' ? true : value === 'false' ? false : value;

/** Campos de texto del formulario multipart; el archivo llega aparte. */
export class CreateReleaseDto {
  @IsIn(RELEASE_PLATFORMS)
  platform!: ReleasePlatform;

  /** Semver con sufijo opcional: `1.4.0`, `1.4.0-beta.2`. */
  @IsString()
  @Matches(/^\d{1,4}\.\d{1,4}\.\d{1,4}(?:[-+][0-9A-Za-z.-]{1,20})?$/, {
    message: 'La versión debe tener el formato 1.2.3 (opcional: 1.2.3-beta.1)',
  })
  version!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  /** Si se omite se publica de inmediato. */
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isPublished?: boolean;
}
