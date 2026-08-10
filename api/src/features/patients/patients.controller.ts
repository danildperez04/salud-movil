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
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { LinkCaregiverDto } from './dto/link-caregiver.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @Roles('admin', 'health_staff')
  create(
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: CreatePatientDto,
  ) {
    return this.patientsService.create(currentUser, dto);
  }

  @Get()
  @Roles('admin', 'health_staff')
  findAll(@CurrentUser() currentUser: JwtPayload, @Query('q') q?: string) {
    return this.patientsService.findAll(currentUser, q);
  }

  @Get('me')
  @Roles('patient')
  findMe(@CurrentUser() currentUser: JwtPayload) {
    return this.patientsService.findMe(currentUser.sub);
  }

  @Get('linked')
  @Roles('caregiver')
  findLinked(@CurrentUser() currentUser: JwtPayload) {
    return this.patientsService.getLinkedPatients(currentUser.sub);
  }

  @Get(':id/caregivers')
  @Roles('admin', 'health_staff')
  getPatientCaregivers(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.patientsService.getPatientCaregivers(id, currentUser);
  }

  @Post(':id/caregivers')
  @Roles('admin', 'health_staff')
  linkCaregiver(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: LinkCaregiverDto,
  ) {
    return this.patientsService.linkCaregiver(id, currentUser, dto);
  }

  @Delete(':id/caregivers/:caregiverId')
  @Roles('admin', 'health_staff')
  unlinkCaregiver(
    @Param('id') id: string,
    @Param('caregiverId') caregiverId: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.patientsService.unlinkCaregiver(id, caregiverId, currentUser);
  }

  @Get(':id')
  @Roles('admin', 'health_staff')
  findOne(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.patientsService.findOne(id, currentUser);
  }

  @Patch(':id')
  @Roles('admin', 'health_staff')
  update(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: UpdatePatientDto,
  ) {
    return this.patientsService.update(id, currentUser, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(id);
  }
}
