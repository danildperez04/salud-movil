import { CreateUserDto } from './create-user.dto';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UpdateUserDto extends CreateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password?: string;
}
