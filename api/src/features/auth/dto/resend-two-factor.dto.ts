import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendTwoFactorDto {
  @ApiProperty({
    description:
      'Identificador opaco del desafío 2FA que sigue vivo. Reenviar pide ' +
      'esperar al menos 30 s desde la emisión anterior.',
    format: 'uuid',
  })
  @IsUUID()
  challengeId!: string;
}
