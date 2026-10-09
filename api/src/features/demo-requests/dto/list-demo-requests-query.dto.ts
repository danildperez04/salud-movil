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
import {
  DEMO_REQUEST_STATUSES,
  type DemoRequestStatus,
} from '../demo-request-status';

export class ListDemoRequestsQueryDto {
  @IsOptional()
  @IsIn(DEMO_REQUEST_STATUSES)
  status?: DemoRequestStatus;

  /** Busca por nombre, correo o institución. */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;
}
