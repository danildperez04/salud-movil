import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterCaregiverDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @Length(3, 50)
  @Matches(/^[a-zA-Z0-9_.-]+$/, {
    message: 'El nombre de usuario solo puede contener letras, números, . _ -',
  })
  username!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsOptional()
  @IsString()
  dni?: string;

  @IsNotEmpty()
  municipalityId!: number;
}
