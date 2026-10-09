import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  DEMO_REQUEST_STATUSES,
  type DemoRequestStatus,
} from '../demo-request-status';

export class ListDemoRequestsQueryDto {
  @ApiPropertyOptional({
    description: 'Filtrar por estado',
    enum: DEMO_REQUEST_STATUSES,
  })
  @IsOptional()
  @IsIn(DEMO_REQUEST_STATUSES)
  status?: DemoRequestStatus;

  /** Busca por nombre, correo o institución. */
  @ApiPropertyOptional({
    description: 'Buscar por nombre, correo o institución',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({
    description: 'Página (base 1)',
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Elementos por página',
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;
}
