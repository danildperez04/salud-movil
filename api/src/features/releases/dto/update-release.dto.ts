import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { toBoolean } from './create-release.dto';

/** Solo se editan los metadatos: para cambiar el archivo se sube otra versión. */
export class UpdateReleaseDto {
  @ApiPropertyOptional({
    description: 'Notas de la versión / changelog',
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @ApiPropertyOptional({ description: 'Publicar / despublicar', type: Boolean })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isPublished?: boolean;
}
