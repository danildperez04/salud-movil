import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
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

/**
 * Implementación real que envía el código por correo electrónico usando Nodemailer.
 *
 * Requiere variables de entorno (ver `.env.example`):
 * - `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASSWORD`, `MAIL_FROM`
 * - `MAIL_TLS` (opcional, default: true)
 * - `MAIL_IGNORE_TLS` (opcional, default: false; para desarrollo con certificados autofirmados)
 */
@Injectable()
export class EmailOtpDelivery extends OtpDelivery {
  private readonly logger = new Logger(EmailOtpDelivery.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    super();
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || '587', 10),
      secure: process.env.MAIL_PORT === '465',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
      tls:
        process.env.MAIL_IGNORE_TLS === 'true'
          ? { rejectUnauthorized: false }
          : undefined,
    });

    // Verificar conexión al arrancar (no bloqueante)
    this.transporter
      .verify()
      .then(() => this.logger.log('Servidor SMTP listo para enviar OTP'))
      .catch((err) => this.logger.error('Error conectando a SMTP', err));
  }

  async send({
    recipient,
    code,
    purpose,
    expiresAt,
  }: OtpMessage): Promise<void> {
    const isLogin = purpose === 'login';
    const subject = isLogin
      ? 'Tu código de acceso a Salud Móvil'
      : 'Activa la verificación en dos pasos';

    const expiresMinutes = Math.ceil(
      (expiresAt.getTime() - Date.now()) / 60000,
    );

    const html = this.renderHtml({
      name: recipient.name,
      code,
      expiresMinutes,
      isLogin,
    });
    const text = this.renderText({
      name: recipient.name,
      code,
      expiresMinutes,
      isLogin,
    });

    await this.transporter.sendMail({
      from: process.env.MAIL_FROM || '"Salud Móvil" <no-reply@saludmovil.app>',
      to: recipient.email,
      subject,
      text,
      html,
    });

    this.logger.log(`Código OTP (${purpose}) enviado a ${recipient.email}`);
  }

  private renderHtml({
    name,
    code,
    expiresMinutes,
    isLogin,
  }: {
    name: string;
    code: string;
    expiresMinutes: number;
    isLogin: boolean;
  }): string {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isLogin ? 'Código de acceso' : 'Activar 2FA'}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <tr>
      <td style="background: #1976d2; padding: 24px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Salud Móvil</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px 24px;">
        <h2 style="margin: 0 0 16px; color: #1a1a2e; font-size: 20px; font-weight: 600;">
          ${isLogin ? 'Tu código de acceso' : 'Activa la verificación en dos pasos'}
        </h2>
        <p style="margin: 0 0 24px; color: #4a4a4a; font-size: 16px; line-height: 1.5;">
          Hola <strong>${name}</strong>,
        </p>
        <p style="margin: 0 0 24px; color: #4a4a4a; font-size: 16px; line-height: 1.5;">
          ${
            isLogin
              ? 'Utiliza el siguiente código para completar tu inicio de sesión:'
              : 'Utiliza el siguiente código para activar la verificación en dos pasos en tu cuenta:'
          }
        </p>
        <div style="background: #f5f5f5; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
          <span style="font-family: 'SF Mono', 'Fira Code', 'Monospace', monospace; font-size: 32px; font-weight: 700; color: #1976d2; letter-spacing: 8px;">${code}</span>
        </div>
        <p style="margin: 24px 0 0; color: #666; font-size: 14px; line-height: 1.5;">
          Este código expira en <strong>${expiresMinutes} minutos</strong>. Si no lo solicitaste, ignora este correo.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background: #fafafa; padding: 16px 24px; text-align: center; border-top: 1px solid #eee;">
        <p style="margin: 0; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} Salud Móvil. Todos los derechos reservados.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  private renderText({
    name,
    code,
    expiresMinutes,
    isLogin,
  }: {
    name: string;
    code: string;
    expiresMinutes: number;
    isLogin: boolean;
  }): string {
    return `
${isLogin ? 'Tu código de acceso a Salud Móvil' : 'Activa la verificación en dos pasos'}

Hola ${name},

${
  isLogin
    ? 'Utiliza el siguiente código para completar tu inicio de sesión:'
    : 'Utiliza el siguiente código para activar la verificación en dos pasos en tu cuenta:'
}

Código: ${code}

Este código expira en ${expiresMinutes} minutos. Si no lo solicitaste, ignora este correo.

---
Salud Móvil
© ${new Date().getFullYear()} Salud Móvil. Todos los derechos reservados.
`;
  }
}
