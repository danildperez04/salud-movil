import { IsUUID, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyTwoFactorDto {
  @ApiProperty({
    description: 'Identificador del desafío 2FA devuelto por el login',
    format: 'uuid',
  })
  @IsUUID()
  challengeId!: string;

  @ApiProperty({
    description: 'Código de 6 dígitos recibido en el segundo factor',
    pattern: '^\\d{6}$',
    example: '123456',
  })
  @Matches(/^\d{6}$/, { message: 'El código debe tener 6 dígitos' })
  code!: string;
}
