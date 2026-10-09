import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  DEMO_REQUEST_STATUSES,
  type DemoRequestStatus,
} from '../demo-request-status';

export class UpdateDemoRequestDto {
  @ApiPropertyOptional({
    description: 'Nuevo estado de la solicitud',
    enum: DEMO_REQUEST_STATUSES,
  })
  @IsOptional()
  @IsIn(DEMO_REQUEST_STATUSES)
  status?: DemoRequestStatus;

  /** Cadena vacía borra las notas. */
  @ApiPropertyOptional({
    description: 'Notas internas del administrador',
    maxLength: 2000,
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MaxLength(2000)
  adminNotes?: string;
}
