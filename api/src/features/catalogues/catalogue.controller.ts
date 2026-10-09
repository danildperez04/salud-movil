import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CatalogueService } from './catalogue.service';

@ApiTags('catalogues')
@Controller('catalogues')
export class CatalogueController {
  constructor(private readonly catalogueService: CatalogueService) {}

  @Get('departments')
  @ApiOperation({ summary: 'Listar departamentos' })
  @ApiResponse({ status: 200, description: 'Lista de departamentos.' })
  departments() {
    return this.catalogueService.departments();
  }

  @Get('genres')
  @ApiOperation({ summary: 'Listar géneros' })
  @ApiResponse({ status: 200, description: 'Lista de géneros.' })
  genres() {
    return this.catalogueService.genres();
  }

  @Get('relationship-types')
  @ApiOperation({ summary: 'Listar tipos de relación cuidador-paciente' })
  @ApiResponse({ status: 200, description: 'Lista de tipos de relación.' })
  relationshipTypes() {
    return this.catalogueService.relationshipTypes();
  }

  @Get('majors')
  @ApiOperation({ summary: 'Listar especialidades médicas' })
  @ApiResponse({ status: 200, description: 'Lista de especialidades.' })
  majors() {
    return this.catalogueService.majors();
  }

  @Get('health-centers')
  @ApiOperation({ summary: 'Listar centros de salud' })
  @ApiResponse({ status: 200, description: 'Lista de centros de salud.' })
  healthCenters() {
    return this.catalogueService.healthCenters();
  }

  @Get('municipalities')
  @ApiOperation({
    summary: 'Listar municipios, opcionalmente filtrados por departamento',
  })
  @ApiResponse({ status: 200, description: 'Lista de municipios.' })
  municipalities(@Query('departmentId') departmentId?: string) {
    return this.catalogueService.municipalities(
      departmentId ? parseInt(departmentId, 10) : undefined,
    );
  }

  @Get('type-indicators')
  @ApiOperation({ summary: 'Listar tipos de indicadores de salud' })
  @ApiResponse({ status: 200, description: 'Lista de tipos de indicadores.' })
  typeIndicators() {
    return this.catalogueService.typeIndicators();
  }

  @Get('appointment-states')
  @ApiOperation({ summary: 'Listar estados de cita' })
  @ApiResponse({ status: 200, description: 'Lista de estados de cita.' })
  appointmentStates() {
    return this.catalogueService.appointmentStates();
  }

  @Get('appointment-types')
  @ApiOperation({ summary: 'Listar tipos de cita' })
  @ApiResponse({ status: 200, description: 'Lista de tipos de cita.' })
  appointmentTypes() {
    return this.catalogueService.appointmentTypes();
  }

  @Get('notification-states')
  @ApiOperation({ summary: 'Listar estados de notificación' })
  @ApiResponse({
    status: 200,
    description: 'Lista de estados de notificación.',
  })
  notificationStates() {
    return this.catalogueService.notificationStates();
  }

  @Get('route-administrations')
  @ApiOperation({ summary: 'Listar vías de administración de medicamentos' })
  @ApiResponse({ status: 200, description: 'Lista de vías de administración.' })
  routeAdministrations() {
    return this.catalogueService.routeAdministrations();
  }
}
