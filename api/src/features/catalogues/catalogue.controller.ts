import { Controller, Get, Query } from '@nestjs/common';
import { CatalogueService } from './catalogue.service';

@Controller('catalogues')
export class CatalogueController {
  constructor(private readonly catalogueService: CatalogueService) {}

  @Get('departments')
  departments() {
    return this.catalogueService.departments();
  }

  @Get('genres')
  genres() {
    return this.catalogueService.genres();
  }

  @Get('relationship-types')
  relationshipTypes() {
    return this.catalogueService.relationshipTypes();
  }

  @Get('majors')
  majors() {
    return this.catalogueService.majors();
  }

  @Get('health-centers')
  healthCenters() {
    return this.catalogueService.healthCenters();
  }

  @Get('municipalities')
  municipalities(@Query('departmentId') departmentId?: string) {
    return this.catalogueService.municipalities(
      departmentId ? parseInt(departmentId, 10) : undefined,
    );
  }

  @Get('type-indicators')
  typeIndicators() {
    return this.catalogueService.typeIndicators();
  }

  @Get('appointment-states')
  appointmentStates() {
    return this.catalogueService.appointmentStates();
  }

  @Get('appointment-types')
  appointmentTypes() {
    return this.catalogueService.appointmentTypes();
  }

  @Get('notification-states')
  notificationStates() {
    return this.catalogueService.notificationStates();
  }

  @Get('route-administrations')
  routeAdministrations() {
    return this.catalogueService.routeAdministrations();
  }
}
