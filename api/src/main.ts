import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

/**
 * Documentación interactiva de la API.
 *
 *   GET /docs       Swagger UI
 *   GET /docs-json  Especificación OpenAPI
 *
 * Detrás de nginx esas rutas se ven como `/api/docs` y `/api/docs-json`
 * (el prefijo se reescribe antes de llegar aquí).
 *
 * Se habilita con `SWAGGER_ENABLED=true`; sin definir, solo fuera de
 * producción: documentar los endpoints de producción a cualquiera no es
 * gratuito, así que allí hay que pedirlo explícitamente.
 */
function isSwaggerEnabled(): boolean {
  const flag = process.env.SWAGGER_ENABLED;
  if (flag !== undefined) return flag === 'true';
  return process.env.NODE_ENV !== 'production';
}

function setupSwagger(app: NestExpressApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Salud Móvil API')
    .setDescription(
      'API del panel Salud Móvil: pacientes, indicadores de salud, ' +
        'agendamiento, medicamentos y administración de instaladores.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger UI arranca con un <script> inline y helmet pone por defecto
  // `script-src 'self'`, que lo bloquearía. Se relaja la CSP solo bajo /docs:
  // es documentación estática que no toca datos de usuario.
  app.use(
    '/docs',
    (_req: unknown, res: Record<string, unknown>, next: () => void) => {
      (res as { setHeader: (name: string, value: string) => void }).setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline'; " +
          "style-src 'self' 'unsafe-inline'; img-src 'self' data:",
      );
      next();
    },
  );

  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Salud Móvil API',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
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
  if (isSwaggerEnabled()) {
    setupSwagger(app);
  }
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
