import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import {
  DEMO_REQUEST_STATUSES,
  type DemoRequestStatus,
} from '../demo-request-status';

export class UpdateDemoRequestDto {
  @IsOptional()
  @IsIn(DEMO_REQUEST_STATUSES)
  status?: DemoRequestStatus;

  /** Cadena vacía borra las notas. */
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MaxLength(2000)
  adminNotes?: string;
}
