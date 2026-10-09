import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService, AuthResponse, LoginResponse } from './auth.service';
import { RegisterCaregiverDto } from './dto/register-caregiver.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Registrar una cuenta de cuidador y abrir sesión',
  })
  @ApiResponse({
    status: 201,
    description: 'Cuenta creada; devuelve el usuario y el token de acceso.',
  })
  @ApiResponse({
    status: 409,
    description: 'El correo o el nombre de usuario ya está en uso.',
  })
  register(@Body() dto: RegisterCaregiverDto): Promise<AuthResponse> {
    return this.authService.registerCaregiver(dto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión con correo o usuario y contraseña' })
  @ApiResponse({
    status: 201,
    description:
      'Con credenciales válidas devuelve el usuario y el token. Si el ' +
      'usuario tiene la verificación en dos pasos activa responde ' +
      '`requiresTwoFactor: true` con el `challengeId` y su vencimiento: el ' +
      'código se canjea en `POST /auth/2fa/verify`.',
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas o cuenta desactivada.',
  })
  login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(dto);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({
    summary: 'Solicitar el restablecimiento de la contraseña',
    description:
      'Siempre responde igual, exista o no la cuenta, para no revelar qué ' +
      'correos están registrados. El token nunca viaja en la respuesta.',
  })
  @ApiResponse({
    status: 201,
    description:
      'Mensaje genérico. El token se entrega por correo; sin proveedor de ' +
      'correo solo se registra en los logs fuera de producción.',
  })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({
    summary: 'Establecer una contraseña nueva con el token recibido',
  })
  @ApiResponse({ status: 201, description: 'Contraseña actualizada.' })
  @ApiResponse({
    status: 400,
    description: 'Token inválido, ya expirado o ya utilizado.',
  })
  resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @ApiBearerAuth()
  @Post('change-password')
  @ApiOperation({
    summary: 'Cambiar la contraseña de la cuenta autenticada',
    description: 'Pide la contraseña actual: un token robado no debe bastar.',
  })
  @ApiResponse({ status: 201, description: 'Contraseña cambiada.' })
  @ApiResponse({
    status: 400,
    description: 'La contraseña actual es incorrecta.',
  })
  changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ChangePasswordDto,
  ): Promise<void> {
    return this.authService.changePassword(user.sub, dto);
  }

  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Perfil del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Usuario con su rol y centro de salud.',
  })
  @ApiResponse({
    status: 401,
    description: 'Sin token, token inválido o cuenta inactiva.',
  })
  me(@CurrentUser() user: JwtPayload) {
    return this.authService.getProfile(user);
  }
}
