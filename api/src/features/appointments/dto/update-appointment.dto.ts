import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsUUID()
  healthcareWorkerId?: string;

  @IsOptional()
  @IsDateString()
  dateHour?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  reason?: string;

  @IsOptional()
  @IsInt()
  appointmentTypeId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  durationMinutes?: number;
}
