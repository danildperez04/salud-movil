import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthResponse, AuthService } from './auth.service';
import { TwoFactorChallengeInfo, TwoFactorService } from './two-factor.service';
import { VerifyTwoFactorDto } from './dto/verify-two-factor.dto';
import { ResendTwoFactorDto } from './dto/resend-two-factor.dto';
import { DisableTwoFactorDto } from './dto/disable-two-factor.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

// Más estricto que el límite global (100/min): un código de 6 dígitos no
// aguanta fuerza bruta, y cada petición de código escribe en el log del servidor.
const STRICT = { default: { limit: 5, ttl: 60_000 } };

@ApiTags('auth')
@Controller('auth/2fa')
export class TwoFactorController {
  constructor(
    private readonly authService: AuthService,
    private readonly twoFactorService: TwoFactorService,
  ) {}

  @Public()
  @Throttle(STRICT)
  @Post('verify')
  @ApiOperation({
    summary: 'Canjear el código de 2FA por la sesión (segundo paso del login)',
  })
  @ApiResponse({
    status: 201,
    description: 'Código correcto: devuelve el usuario y el token de acceso.',
  })
  @ApiResponse({
    status: 401,
    description: 'Código inválido o expirado (o agotados los 5 intentos).',
  })
  @ApiResponse({
    status: 429,
    description: 'Demasiados intentos en el minuto.',
  })
  verify(@Body() dto: VerifyTwoFactorDto): Promise<AuthResponse> {
    return this.authService.completeTwoFactorLogin(dto);
  }

  @Public()
  @Throttle(STRICT)
  @Post('resend')
  @ApiOperation({
    summary: 'Pedir otro código para un desafío que sigue vivo',
    description:
      'Invalida el código anterior y emite uno nuevo. Hay un periodo de ' +
      'espera de 30 s desde la última emisión.',
  })
  @ApiResponse({
    status: 201,
    description: 'Nuevo `challengeId` y vencimiento del código.',
  })
  @ApiResponse({
    status: 400,
    description: 'El desafío ya no es válido: hay que volver a empezar.',
  })
  @ApiResponse({
    status: 429,
    description: 'Toca esperar antes de pedir otro código.',
  })
  resend(@Body() dto: ResendTwoFactorDto): Promise<TwoFactorChallengeInfo> {
    return this.twoFactorService.resend(dto.challengeId);
  }

  @ApiBearerAuth()
  @Throttle(STRICT)
  @Post('enable')
  @ApiOperation({
    summary: 'Activar 2FA: paso 1, enviar el código de confirmación',
  })
  @ApiResponse({
    status: 201,
    description: 'Código enviado; devuelve el `challengeId` y su vencimiento.',
  })
  @ApiResponse({
    status: 409,
    description: 'La verificación en dos pasos ya está activa.',
  })
  enable(@CurrentUser() user: JwtPayload): Promise<TwoFactorChallengeInfo> {
    return this.twoFactorService.startEnable(user.sub);
  }

  @ApiBearerAuth()
  @Throttle(STRICT)
  @Post('enable/confirm')
  @ApiOperation({
    summary: 'Activar 2FA: paso 2, confirmar el código recibido',
  })
  @ApiResponse({
    status: 201,
    description: 'La verificación en dos pasos queda activa.',
  })
  @ApiResponse({
    status: 400,
    description: 'Código inválido o expirado (o agotados los intentos).',
  })
  confirmEnable(
    @CurrentUser() user: JwtPayload,
    @Body() dto: VerifyTwoFactorDto,
  ): Promise<{ twoFactorEnabled: true }> {
    return this.twoFactorService.confirmEnable(
      user.sub,
      dto.challengeId,
      dto.code,
    );
  }

  @ApiBearerAuth()
  @Throttle(STRICT)
  @Post('disable')
  @ApiOperation({
    summary: 'Desactivar 2FA',
    description:
      'Pide la contraseña: un access token robado no debe poder quitar el ' +
      'segundo factor.',
  })
  @ApiResponse({
    status: 201,
    description: 'La verificación en dos pasos queda desactivada.',
  })
  @ApiResponse({ status: 400, description: 'La contraseña es incorrecta.' })
  disable(
    @CurrentUser() user: JwtPayload,
    @Body() dto: DisableTwoFactorDto,
  ): Promise<{ twoFactorEnabled: false }> {
    return this.twoFactorService.disable(user.sub, dto.password);
  }
}
