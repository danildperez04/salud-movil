import { IsUUID, Matches } from 'class-validator';

export class VerifyTwoFactorDto {
  @IsUUID()
  challengeId!: string;

  @Matches(/^\d{6}$/, { message: 'El código debe tener 6 dígitos' })
  code!: string;
}
