import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

/**
 * `TRUST_PROXY` = cuántos proxies hay entre el cliente y la API (nginx = 1).
 * Acepta también `true`/`false` o una lista de IPs/subredes (formato de Express).
 *
 * Sin esto, detrás de un reverse proxy `req.ip` es siempre la IP del proxy y el
 * límite por IP de `@nestjs/throttler` se convierte en un único contador
 * compartido por todos los usuarios.
 */
function parseTrustProxy(value: string): boolean | number | string {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return /^\d+$/.test(value) ? parseInt(value, 10) : value;
}

/** `CORS_ORIGIN` admite varios orígenes separados por coma; sin definir, `*`. */
function parseCorsOrigin(value: string | undefined): string[] | '*' {
  if (value === undefined) return '*';
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  if (process.env.TRUST_PROXY) {
    app.set('trust proxy', parseTrustProxy(process.env.TRUST_PROXY));
  }
  app.use(helmet());
  app.enableCors({
    origin: parseCorsOrigin(process.env.CORS_ORIGIN),
    credentials: false,
    // Cachea el preflight 10 min: evita un OPTIONS extra por cada petición.
    maxAge: 600,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
