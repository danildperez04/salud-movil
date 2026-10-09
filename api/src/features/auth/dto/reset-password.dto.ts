import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Token de un solo uso recibido por correo',
    example: 'a3f1c2d4e5b6...',
  })
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({
    description: 'Contraseña nueva',
    minLength: 8,
    format: 'password',
  })
  @IsString()
  @MinLength(8)
  newPassword!: string;
}
