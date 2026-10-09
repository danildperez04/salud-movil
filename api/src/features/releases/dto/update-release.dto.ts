import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { toBoolean } from './create-release.dto';

/** Solo se editan los metadatos: para cambiar el archivo se sube otra versión. */
export class UpdateReleaseDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isPublished?: boolean;
}
