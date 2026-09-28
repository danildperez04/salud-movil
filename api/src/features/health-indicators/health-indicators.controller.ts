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
import { HealthIndicatorsService } from './health-indicators.service';
import { CreateHealthIndicatorDto } from './dto/create-health-indicator.dto';
import { UpdateHealthIndicatorDto } from './dto/update-health-indicator.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

@Controller('patients')
export class HealthIndicatorsController {
  constructor(
    private readonly healthIndicatorsService: HealthIndicatorsService,
  ) {}

  // === Paciente (auto-registro, HU-13/14/17) ===

  @Post('me/health-indicators')
  @Roles('patient')
  createForMe(
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: CreateHealthIndicatorDto,
  ) {
    return this.healthIndicatorsService.createForMe(currentUser, dto);
  }

  @Get('me/health-indicators')
  @Roles('patient')
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
  removeForMe(
    @Param('indicatorId') indicatorId: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.healthIndicatorsService.removeForMe(indicatorId, currentUser);
  }

  // === Personal / Admin (HU-13/14/16) ===

  @Post(':id/health-indicators')
  @Roles('admin', 'health_staff')
  create(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: CreateHealthIndicatorDto,
  ) {
    return this.healthIndicatorsService.create(id, currentUser, dto);
  }

  @Get(':id/health-indicators')
  @Roles('admin', 'health_staff')
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
  latest(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.healthIndicatorsService.latest(id, currentUser);
  }

  @Get(':id/health-indicators/summary')
  @Roles('admin', 'health_staff')
  summary(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.healthIndicatorsService.summary(id, currentUser);
  }

  @Patch(':id/health-indicators/:indicatorId')
  @Roles('admin', 'health_staff')
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
  remove(
    @Param('id') id: string,
    @Param('indicatorId') indicatorId: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.healthIndicatorsService.remove(id, indicatorId, currentUser);
  }
}
