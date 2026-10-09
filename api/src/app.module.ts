import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import config from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './features/users/users.module';
import { AuthModule } from './features/auth/auth.module';
import { CatalogueModule } from './features/catalogues/catalogue.module';
import { PatientsModule } from './features/patients/patients.module';
import { MedicalRecordsModule } from './features/medical-records/medical-records.module';
import { IpcpModule } from './features/ipcp/ipcp.module';
import { HealthIndicatorsModule } from './features/health-indicators/health-indicators.module';
import { AppointmentsModule } from './features/appointments/appointments.module';
import { MedicationsModule } from './features/medications/medications.module';
import { RemindersModule } from './features/reminders/reminders.module';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { ReleasesModule } from './features/releases/releases.module';
import { DemoRequestsModule } from './features/demo-requests/demo-requests.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [config],
    }),
    ThrottlerModule.forRoot([
      {
        // Límite por IP para todo el API. Afecta sobre todo a login y
        // recuperación de contraseña, que son los que se atacan por fuerza bruta.
        ttl: parseInt(process.env.THROTTLE_TTL_MS ?? '60000', 10),
        limit: parseInt(process.env.THROTTLE_LIMIT ?? '100', 10),
      },
    ]),
    TypeOrmModule.forRoot({
      type: config().db.type,
      host: config().db.host,
      port: config().db.port,
      username: config().db.user,
      password: config().db.password,
      database: config().db.database,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // El esquema lo gobiernan las migraciones (`pnpm migration:run`), nunca el
      // arranque. Con `synchronize: true` cualquier despliegue alteraba la base
      // de producción sin revisión: es la razón por la que los despliegues
      // estuvieron aplazados. Ver `docs/Guia_de_Despliegue.md` §7.
      synchronize: false,
      // El log de SQL imprime valores de pacientes. Solo en desarrollo.
      logging: config().db.logging,
    }),
    UsersModule,
    AuthModule,
    CatalogueModule,
    // IpcpModule va antes que PatientsModule a propósito: ambas montan rutas
    // bajo `patients` y Express resuelve en orden de registro, así que el
    // literal `GET /patients/ipcp` debe registrarse antes que `GET
    // /patients/:id`. Si se reordenan estos imports, `:id` captura "ipcp" y
    // el endpoint responde 500 con "invalid input syntax for type uuid".
    IpcpModule,
    PatientsModule,
    MedicalRecordsModule,
    HealthIndicatorsModule,
    AppointmentsModule,
    MedicationsModule,
    RemindersModule,
    DashboardModule,
    ReleasesModule,
    DemoRequestsModule,
    DatabaseModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    // Se registra antes que JwtAuthGuard (que vive en AuthModule) para que el
    // límite por IP se aplique también a las rutas públicas, como /auth/login.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
