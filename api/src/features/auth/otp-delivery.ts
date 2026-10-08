import { Injectable, Logger } from '@nestjs/common';
import type { OtpPurpose } from './entities/otp-challenge.entity';

export interface OtpMessage {
  recipient: { id: string; name: string; email: string };
  code: string;
  purpose: OtpPurpose;
  expiresAt: Date;
}

/**
 * Canal por el que llega el código al usuario. Es una clase abstracta (y no una
 * interfaz) para poder usarla como token de inyección: el día que exista un
 * servicio de correo o SMS basta con registrar otra implementación en
 * `AuthModule`, sin tocar `TwoFactorService`.
 */
export abstract class OtpDelivery {
  abstract send(message: OtpMessage): Promise<void>;
}

/**
 * Implementación provisional: escribe el código en el log del servidor.
 *
 * ⚠️ No hay canal real todavía. Quien pueda leer los logs puede ver los
 * códigos y, conociendo la contraseña, completar el login: el segundo factor
 * solo protege frente a quien no tiene acceso a los logs. Reemplazar antes de
 * tratar el 2FA como una barrera real.
 */
@Injectable()
export class ConsoleOtpDelivery extends OtpDelivery {
  private readonly logger = new Logger('OtpDelivery');

  send({ recipient, code, purpose, expiresAt }: OtpMessage): Promise<void> {
    this.logger.warn(
      `Código OTP (${purpose}) para ${recipient.email}: ${code} (vence ${expiresAt.toISOString()})`,
    );
    return Promise.resolve();
  }
}
