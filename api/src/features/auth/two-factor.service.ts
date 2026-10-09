import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { createHash, randomInt, timingSafeEqual } from 'crypto';
import { LessThan, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { OtpChallenge, OtpPurpose } from './entities/otp-challenge.entity';
import { OtpDelivery } from './otp-delivery';

export const OTP_LENGTH = 6;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_MS = 30_000;
const DEFAULT_EXPIRES_MINUTES = 5;

export interface TwoFactorChallengeInfo {
  challengeId: string;
  expiresAt: Date;
}

const hashCode = (code: string) =>
  createHash('sha256').update(code).digest('hex');

const sameHash = (a: string, b: string) =>
  a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

/**
 * Códigos OTP para la verificación en dos pasos. El desafío es un registro en
 * base de datos con un id opaco, no un JWT: no existe ningún token del que el
 * `JwtAuthGuard` pueda confundirse.
 */
@Injectable()
export class TwoFactorService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(OtpChallenge)
    private readonly challenges: Repository<OtpChallenge>,
    private readonly delivery: OtpDelivery,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Emite un código nuevo. Invalida el anterior del mismo propósito, así que
   * pedir otro código nunca deja dos válidos a la vez.
   */
  async issue(
    user: Pick<User, 'id' | 'name' | 'email'>,
    purpose: OtpPurpose,
  ): Promise<TwoFactorChallengeInfo> {
    const code = randomInt(0, 10 ** OTP_LENGTH)
      .toString()
      .padStart(OTP_LENGTH, '0');

    await this.challenges.delete({ userId: user.id, purpose });
    const challenge = await this.challenges.save(
      this.challenges.create({
        userId: user.id,
        purpose,
        codeHash: hashCode(code),
        expiresAt: new Date(Date.now() + this.expiresMs()),
      }),
    );

    await this.delivery.send({
      recipient: { id: user.id, name: user.name, email: user.email },
      code,
      purpose,
      expiresAt: challenge.expiresAt,
    });

    return { challengeId: challenge.id, expiresAt: challenge.expiresAt };
  }

  /**
   * Valida y gasta un código; devuelve el id del usuario al que pertenece.
   *
   * Todos los fallos responden lo mismo para no revelar si el desafío existe,
   * venció o se agotó. El intento se gasta **antes** de comparar, con un
   * `UPDATE` condicional: así peticiones en paralelo no pueden pasar de
   * `OTP_MAX_ATTEMPTS` adivinanzas en total.
   */
  async consume(
    challengeId: string,
    code: string,
    purpose: OtpPurpose,
    expectedUserId?: string,
  ): Promise<string> {
    const challenge = await this.challenges.findOne({
      where: { id: challengeId, purpose },
    });
    if (
      !challenge ||
      challenge.expiresAt.getTime() < Date.now() ||
      (expectedUserId && challenge.userId !== expectedUserId)
    ) {
      throw this.invalidCode(purpose);
    }

    const spent = await this.challenges.update(
      { id: challenge.id, attempts: LessThan(OTP_MAX_ATTEMPTS) },
      { attempts: () => 'attempts + 1' },
    );
    if (!spent.affected) {
      throw this.invalidCode(purpose);
    }

    if (!sameHash(hashCode(code), challenge.codeHash)) {
      throw this.invalidCode(purpose);
    }

    // Un solo uso: si dos peticiones con el código correcto llegan a la vez,
    // solo a una le toca borrar la fila.
    const consumed = await this.challenges.delete({ id: challenge.id });
    if (!consumed.affected) {
      throw this.invalidCode(purpose);
    }
    return challenge.userId;
  }

  /** Reenvía el código de un desafío vivo: lo reemplaza por uno nuevo. */
  async resend(challengeId: string): Promise<TwoFactorChallengeInfo> {
    const previous = await this.challenges.findOne({
      where: { id: challengeId },
    });
    const user = previous
      ? await this.users.findOne({ where: { id: previous.userId } })
      : null;
    if (!previous || !user || !user.isActive) {
      throw new BadRequestException(
        'La verificación ya no es válida, vuelve a empezar',
      );
    }

    // La hora de emisión se deduce del vencimiento: `created_at` lo escribe la
    // base con su zona horaria y no es comparable con `Date.now()`.
    const issuedAt = previous.expiresAt.getTime() - this.expiresMs();
    if (Date.now() - issuedAt < OTP_RESEND_COOLDOWN_MS) {
      throw new HttpException(
        'Espera unos segundos antes de pedir otro código',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return this.issue(user, previous.purpose);
  }

  /** Paso 1 de activar el 2FA: envía el código de confirmación. */
  async startEnable(userId: string): Promise<TwoFactorChallengeInfo> {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    if (user.twoFactorEnabled) {
      throw new ConflictException(
        'La verificación en dos pasos ya está activa',
      );
    }
    return this.issue(user, 'enable');
  }

  /** Paso 2: con el código correcto, el 2FA queda activo. */
  async confirmEnable(
    userId: string,
    challengeId: string,
    code: string,
  ): Promise<{ twoFactorEnabled: true }> {
    await this.consume(challengeId, code, 'enable', userId);
    await this.users.update({ id: userId }, { twoFactorEnabled: true });
    return { twoFactorEnabled: true };
  }

  /**
   * Desactivar pide la contraseña: quien robe un access token no debe poder
   * quitar el segundo factor.
   */
  async disable(
    userId: string,
    password: string,
  ): Promise<{ twoFactorEnabled: false }> {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new BadRequestException('La contraseña es incorrecta');
    }
    await this.users.update({ id: userId }, { twoFactorEnabled: false });
    await this.challenges.delete({ userId });
    return { twoFactorEnabled: false };
  }

  /**
   * En el login (endpoint público) un código malo es un 401. En los endpoints
   * autenticados tiene que ser un 400: los clientes cierran la sesión ante
   * cualquier 401 con token, y equivocarse de código no debe sacar al usuario.
   */
  private invalidCode(purpose: OtpPurpose): HttpException {
    const message = 'Código inválido o expirado';
    return purpose === 'login'
      ? new UnauthorizedException(message)
      : new BadRequestException(message);
  }

  private expiresMs(): number {
    const minutes =
      parseInt(
        this.configService.get<string>('OTP_EXPIRES_MINUTES') ??
          String(DEFAULT_EXPIRES_MINUTES),
        10,
      ) || DEFAULT_EXPIRES_MINUTES;
    return minutes * 60_000;
  }
}
