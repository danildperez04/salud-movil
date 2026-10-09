import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HealthIndicatorsService } from './health-indicators.service';
import { CreateHealthIndicatorDto } from './dto/create-health-indicator.dto';
import { UpdateHealthIndicatorDto } from './dto/update-health-indicator.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

@ApiTags('health-indicators')
@ApiBearerAuth()
@Controller('patients')
export class HealthIndicatorsController {
  constructor(
    private readonly healthIndicatorsService: HealthIndicatorsService,
  ) {}

  // === Paciente (auto-registro, HU-13/14/17) ===

  @Post('me/health-indicators')
  @Roles('patient')
  @ApiOperation({
    summary: 'Registrar un indicador de salud propio (paciente)',
  })
  @ApiResponse({ status: 201, description: 'Indicador registrado.' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o tipo no encontrado.',
  })
  createForMe(
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: CreateHealthIndicatorDto,
  ) {
    return this.healthIndicatorsService.createForMe(currentUser, dto);
  }

  @Get('me/health-indicators')
  @Roles('patient')
  @ApiOperation({
    summary: 'Listar indicadores de salud propios con filtros opcionales',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de indicadores con filtros aplicados.',
  })
  listForMe(
    @CurrentUser() currentUser: JwtPayload,
    @Query('typeIndicatorId') typeIndicatorId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.healthIndicatorsService.listForMe(currentUser, {
      typeIndicatorId: typeIndicatorId
        ? parseInt(typeIndicatorId, 10)
        : undefined,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
  }

  @Patch('me/health-indicators/:indicatorId')
  @Roles('patient')
  @ApiOperation({
    summary: 'Actualizar un indicador de salud propio (paciente)',
  })
  @ApiResponse({ status: 200, description: 'Indicador actualizado.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 404, description: 'Indicador no encontrado.' })
  updateForMe(
    @Param('indicatorId') indicatorId: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: UpdateHealthIndicatorDto,
  ) {
    return this.healthIndicatorsService.updateForMe(
      indicatorId,
      currentUser,
      dto,
    );
  }

  @Delete('me/health-indicators/:indicatorId')
  @Roles('patient')
  @ApiOperation({ summary: 'Eliminar un indicador de salud propio (paciente)' })
  @ApiResponse({ status: 200, description: 'Indicador eliminado.' })
  @ApiResponse({ status: 404, description: 'Indicador no encontrado.' })
  removeForMe(
    @Param('indicatorId') indicatorId: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.healthIndicatorsService.removeForMe(indicatorId, currentUser);
  }

  // === Personal / Admin (HU-13/14/16) ===

  @Post(':id/health-indicators')
  @Roles('admin', 'health_staff')
  @ApiOperation({
    summary:
      'Registrar un indicador de salud para un paciente (personal o admin)',
  })
  @ApiResponse({ status: 201, description: 'Indicador registrado.' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o tipo no encontrado.',
  })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  create(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: CreateHealthIndicatorDto,
  ) {
    return this.healthIndicatorsService.create(id, currentUser, dto);
  }

  @Get(':id/health-indicators')
  @Roles('admin', 'health_staff')
  @ApiOperation({
    summary: 'Listar indicadores de un paciente con filtros (personal o admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de indicadores con filtros.',
  })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  list(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Query('typeIndicatorId') typeIndicatorId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.healthIndicatorsService.list(id, currentUser, {
      typeIndicatorId: typeIndicatorId
        ? parseInt(typeIndicatorId, 10)
        : undefined,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
  }

  @Get(':id/health-indicators/latest')
  @Roles('admin', 'health_staff')
  @ApiOperation({
    summary: 'Obtener el último indicador de cada tipo para un paciente',
  })
  @ApiResponse({ status: 200, description: 'Últimos indicadores por tipo.' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  latest(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.healthIndicatorsService.latest(id, currentUser);
  }

  @Get(':id/health-indicators/summary')
  @Roles('admin', 'health_staff')
  @ApiOperation({
    summary: 'Resumen estadístico de indicadores de un paciente',
  })
  @ApiResponse({
    status: 200,
    description: 'Resumen con promedios, mínimos, máximos por tipo.',
  })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  summary(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.healthIndicatorsService.summary(id, currentUser);
  }

  @Patch(':id/health-indicators/:indicatorId')
  @Roles('admin', 'health_staff')
  @ApiOperation({
    summary:
      'Actualizar un indicador de salud de un paciente (personal o admin)',
  })
  @ApiResponse({ status: 200, description: 'Indicador actualizado.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({
    status: 404,
    description: 'Indicador o paciente no encontrado.',
  })
  update(
    @Param('id') id: string,
    @Param('indicatorId') indicatorId: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: UpdateHealthIndicatorDto,
  ) {
    return this.healthIndicatorsService.update(
      id,
      indicatorId,
      currentUser,
      dto,
    );
  }

  @Delete(':id/health-indicators/:indicatorId')
  @Roles('admin', 'health_staff')
  @ApiOperation({
    summary: 'Eliminar un indicador de salud de un paciente (personal o admin)',
  })
  @ApiResponse({ status: 200, description: 'Indicador eliminado.' })
  @ApiResponse({
    status: 404,
    description: 'Indicador o paciente no encontrado.',
  })
  remove(
    @Param('id') id: string,
    @Param('indicatorId') indicatorId: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.healthIndicatorsService.remove(id, indicatorId, currentUser);
  }
}
