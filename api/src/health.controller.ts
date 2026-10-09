import {
  Controller,
  Get,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { DataSource } from 'typeorm';
import { Public } from './common/decorators/public.decorator';

/**
 * Sonda de salud para Docker, el reverse proxy y los orquestadores.
 *
 * Verifica también la conexión a la base: una API que arranca pero no alcanza
 * su base de datos no está lista para recibir tráfico. Es pública y queda fuera
 * del límite por IP porque las sondas la consultan cada pocos segundos. No
 * devuelve detalles del fallo para no filtrar información de la infraestructura.
 */
@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(private readonly dataSource: DataSource) {}

  @Public()
  @SkipThrottle()
  @Get()
  async check(): Promise<{ status: 'ok' }> {
    try {
      await this.dataSource.query('SELECT 1');
    } catch (error) {
      this.logger.error(
        'Health check: la base de datos no responde',
        error instanceof Error ? error.stack : String(error),
      );
      throw new ServiceUnavailableException('Base de datos no disponible');
    }
    return { status: 'ok' };
  }
}
