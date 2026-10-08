import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
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

@Controller('auth/2fa')
export class TwoFactorController {
  constructor(
    private readonly authService: AuthService,
    private readonly twoFactorService: TwoFactorService,
  ) {}

  @Public()
  @Throttle(STRICT)
  @Post('verify')
  verify(@Body() dto: VerifyTwoFactorDto): Promise<AuthResponse> {
    return this.authService.completeTwoFactorLogin(dto);
  }

  @Public()
  @Throttle(STRICT)
  @Post('resend')
  resend(@Body() dto: ResendTwoFactorDto): Promise<TwoFactorChallengeInfo> {
    return this.twoFactorService.resend(dto.challengeId);
  }

  @Throttle(STRICT)
  @Post('enable')
  enable(@CurrentUser() user: JwtPayload): Promise<TwoFactorChallengeInfo> {
    return this.twoFactorService.startEnable(user.sub);
  }

  @Throttle(STRICT)
  @Post('enable/confirm')
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

  @Throttle(STRICT)
  @Post('disable')
  disable(
    @CurrentUser() user: JwtPayload,
    @Body() dto: DisableTwoFactorDto,
  ): Promise<{ twoFactorEnabled: false }> {
    return this.twoFactorService.disable(user.sub, dto.password);
  }
}
