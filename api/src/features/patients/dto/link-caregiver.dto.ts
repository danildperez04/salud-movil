import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class LinkCaregiverDto {
  @IsNotEmpty()
  caregiverId!: string;

  @IsNotEmpty()
  relationshipTypeId!: number;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
