import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { ListDemoRequestsQueryDto } from './dto/list-demo-requests-query.dto';
import { UpdateDemoRequestDto } from './dto/update-demo-request.dto';
import { DemoRequest } from './entities/demo-request.entity';
import {
  DemoRequestPage,
  DemoRequestStats,
  DemoRequestsService,
} from './demo-requests.service';

/** Gestión de solicitudes. Solo administradores. */
@ApiTags('demo-requests')
@ApiBearerAuth()
@Controller('admin/demo-requests')
@Roles('admin')
export class AdminDemoRequestsController {
  constructor(private readonly demoRequestsService: DemoRequestsService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar solicitudes de demo con filtros y paginación (admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Página de solicitudes con metadatos.',
  })
  findAll(@Query() query: ListDemoRequestsQueryDto): Promise<DemoRequestPage> {
    return this.demoRequestsService.findAll(query);
  }

  // Antes de `:id`, para que "stats" no se interprete como un id.
  @Get('stats')
  @ApiOperation({ summary: 'Estadísticas de solicitudes de demo (admin)' })
  @ApiResponse({ status: 200, description: 'Contadores por estado y totales.' })
  stats(): Promise<DemoRequestStats> {
    return this.demoRequestsService.stats();
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar estado o notas de una solicitud (admin)',
  })
  @ApiResponse({ status: 200, description: 'Solicitud actualizada.' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDemoRequestDto,
  ): Promise<DemoRequest> {
    return this.demoRequestsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar una solicitud de demo (admin)' })
  @ApiResponse({ status: 204, description: 'Solicitud eliminada.' })
  @ApiResponse({ status: 404, description: 'Solicitud no encontrada.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.demoRequestsService.remove(id);
  }
}
