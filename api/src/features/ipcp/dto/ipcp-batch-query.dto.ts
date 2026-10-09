import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

/** Niveles que acepta `?level=`. Deben coincidir con `IpcpLevel`. */
const IPCP_LEVELS = ['high', 'moderate', 'low'] as const;

const SORT_FIELDS = ['score', 'level', 'name'] as const;
const SORT_ORDERS = ['asc', 'desc'] as const;

/**
 * Query params de `GET /patients/ipcp`.
 *
 * El `ValidationPipe` global corre con `whitelist` + `forbidNonWhitelisted`,
 * así que un parámetro no declarado aquí responde 400 en vez de ignorarse:
 * un typo en el panel falla ruidosamente y no devuelve media lista.
 *
 * Los números llegan como string (`?page=2`); `@Type` los convierte antes de
 * `@IsInt`, que sobre el string crudo siempre fallaría.
 */
export class IpcpBatchQueryDto {
  @IsOptional()
  @IsIn(IPCP_LEVELS)
  level?: (typeof IPCP_LEVELS)[number];

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  /**
   * El tope de 1000 cubre las vistas que cargan el panel completo de una vez
   * (mapa de prioridad y las tarjetas de Inicio). Más allá, la página siguiente
   * sigue disponible.
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  limit?: number;

  @IsOptional()
  @IsIn(SORT_FIELDS)
  sortBy?: (typeof SORT_FIELDS)[number];

  @IsOptional()
  @IsIn(SORT_ORDERS)
  sortOrder?: (typeof SORT_ORDERS)[number];

  /**
   * Centra el listado en un centro de salud.
   *
   * Solo lo aplica el admin: el personal de salud recibe siempre el suyo, que
   * se resuelve en el servidor, de modo que un parámetro manipulado desde el
   * navegador no amplía su alcance.
   */
  @IsOptional()
  @IsUUID()
  healthCenterId?: string;
}
