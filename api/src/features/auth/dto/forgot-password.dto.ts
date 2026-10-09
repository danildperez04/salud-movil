import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Correo de la cuenta a recuperar',
    format: 'email',
    example: 'paciente@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
