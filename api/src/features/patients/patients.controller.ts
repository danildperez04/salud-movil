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
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { LinkCaregiverDto } from './dto/link-caregiver.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

@ApiTags('patients')
@ApiBearerAuth()
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @Roles('admin', 'health_staff')
  @ApiOperation({ summary: 'Crear un paciente (admin o personal de salud)' })
  @ApiResponse({ status: 201, description: 'Paciente creado.' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o centro/municipio no encontrado.',
  })
  @ApiResponse({ status: 409, description: 'DNI ya registrado.' })
  create(
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: CreatePatientDto,
  ) {
    return this.patientsService.create(currentUser, dto);
  }

  @Get()
  @Roles('admin', 'health_staff')
  @ApiOperation({
    summary:
      'Listar pacientes con búsqueda opcional (admin o personal de salud)',
  })
  @ApiResponse({ status: 200, description: 'Listado paginado de pacientes.' })
  findAll(@CurrentUser() currentUser: JwtPayload, @Query('q') q?: string) {
    return this.patientsService.findAll(currentUser, q);
  }

  @Get('me')
  @Roles('patient')
  @ApiOperation({ summary: 'Obtener el perfil del paciente autenticado' })
  @ApiResponse({ status: 200, description: 'Datos del paciente.' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  findMe(@CurrentUser() currentUser: JwtPayload) {
    return this.patientsService.findMe(currentUser.sub);
  }

  @Get('linked')
  @Roles('caregiver')
  @ApiOperation({
    summary: 'Listar pacientes vinculados al cuidador autenticado',
  })
  @ApiResponse({ status: 200, description: 'Pacientes del cuidador.' })
  findLinked(@CurrentUser() currentUser: JwtPayload) {
    return this.patientsService.getLinkedPatients(currentUser.sub);
  }

  @Get(':id/caregivers')
  @Roles('admin', 'health_staff')
  @ApiOperation({ summary: 'Listar cuidadores vinculados a un paciente' })
  @ApiResponse({ status: 200, description: 'Cuidadores del paciente.' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  getPatientCaregivers(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.patientsService.getPatientCaregivers(id, currentUser);
  }

  @Post(':id/caregivers')
  @Roles('admin', 'health_staff')
  @ApiOperation({ summary: 'Vincular un cuidador a un paciente' })
  @ApiResponse({ status: 201, description: 'Cuidador vinculado al paciente.' })
  @ApiResponse({
    status: 400,
    description: 'Cuidador ya vinculado o no encontrado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Paciente o cuidador no encontrado.',
  })
  linkCaregiver(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: LinkCaregiverDto,
  ) {
    return this.patientsService.linkCaregiver(id, currentUser, dto);
  }

  @Delete(':id/caregivers/:caregiverId')
  @Roles('admin', 'health_staff')
  @ApiOperation({ summary: 'Desvincular un cuidador de un paciente' })
  @ApiResponse({ status: 200, description: 'Cuidador desvinculado.' })
  @ApiResponse({
    status: 404,
    description: 'Vínculo, paciente o cuidador no encontrado.',
  })
  unlinkCaregiver(
    @Param('id') id: string,
    @Param('caregiverId') caregiverId: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.patientsService.unlinkCaregiver(id, caregiverId, currentUser);
  }

  @Get(':id')
  @Roles('admin', 'health_staff')
  @ApiOperation({
    summary: 'Obtener un paciente por su ID (admin o personal de salud)',
  })
  @ApiResponse({ status: 200, description: 'Datos completos del paciente.' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  findOne(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.patientsService.findOne(id, currentUser);
  }

  @Patch(':id')
  @Roles('admin', 'health_staff')
  @ApiOperation({
    summary: 'Actualizar un paciente (admin o personal de salud)',
  })
  @ApiResponse({ status: 200, description: 'Paciente actualizado.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  @ApiResponse({ status: 409, description: 'DNI ya registrado.' })
  update(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: UpdatePatientDto,
  ) {
    return this.patientsService.update(id, currentUser, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar un paciente (soft delete, solo admin)' })
  @ApiResponse({ status: 200, description: 'Paciente marcado como eliminado.' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  remove(@Param('id') id: string) {
    return this.patientsService.remove(id);
  }
}
