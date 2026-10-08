import { IsNotEmpty, IsString } from 'class-validator';

export class DisableTwoFactorDto {
  @IsString()
  @IsNotEmpty()
  password!: string;
}
