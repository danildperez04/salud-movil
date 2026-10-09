import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Correo o nombre de usuario de la cuenta',
    example: 'admin@saludmovil.com',
  })
  @IsString()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: 'Contraseña de la cuenta', format: 'password' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
