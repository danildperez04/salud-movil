import { IsIn, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Filtro de `GET /users`.
 *
 * Existe porque el panel solo necesita personal de salud en sus dos únicos
 * usos, y antes descargaba **todos** los usuarios —pacientes y cuidadores
 * incluidos— para filtrar en el navegador. Eso es tráfico de más y expone
 * registros que la pantalla no muestra.
 */
export class ListUsersQueryDto {
  /** Código de `cat_role.code`. */
  @ApiPropertyOptional({
    description: 'Filtrar por código de rol',
    enum: ['admin', 'health_staff', 'patient', 'caregiver'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['admin', 'health_staff', 'patient', 'caregiver'])
  role?: string;
}
