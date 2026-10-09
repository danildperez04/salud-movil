import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Contraseña vigente de la cuenta' })
  @IsString()
  @IsNotEmpty()
  currentPassword!: string;

  @ApiProperty({
    description: 'Contraseña nueva',
    minLength: 8,
    example: 'NuevaClave123',
  })
  @IsString()
  @MinLength(8)
  newPassword!: string;
}
