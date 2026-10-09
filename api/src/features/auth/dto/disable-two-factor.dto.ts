import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DisableTwoFactorDto {
  @ApiProperty({
    description:
      'Contraseña de la cuenta. Desactivar 2FA pide credenciales: con solo ' +
      'un token robado no se debe poder quitar el segundo factor.',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
