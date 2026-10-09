import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LinkCaregiverDto {
  @ApiProperty({
    description: 'Identificador del cuidador a vincular',
    format: 'uuid',
  })
  @IsNotEmpty()
  caregiverId!: string;

  @ApiProperty({
    description: 'Identificador del tipo de relación (catálogo)',
    example: 1,
  })
  @IsNotEmpty()
  relationshipTypeId!: number;

  @ApiPropertyOptional({
    description: 'Si es el cuidador principal',
    type: Boolean,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
