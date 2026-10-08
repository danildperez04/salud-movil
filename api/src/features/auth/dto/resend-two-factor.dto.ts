import { IsUUID } from 'class-validator';

export class ResendTwoFactorDto {
  @IsUUID()
  challengeId!: string;
}
