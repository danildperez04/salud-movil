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

export class CreateAppointmentDto {
  @IsOptional()
  @IsUUID()
  healthcareWorkerId?: string;

  @IsDateString()
  dateHour!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  reason!: string;

  @IsInt()
  appointmentTypeId!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  durationMinutes?: number;
}
