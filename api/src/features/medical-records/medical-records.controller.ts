import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MedicalRecordsService } from './medical-records.service';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { CreateMedicalVisitDto } from './dto/create-medical-visit.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

@ApiTags('medical-records')
@ApiBearerAuth()
@Controller('patients')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Put(':id/medical-record')
  @Roles('admin', 'health_staff')
  @ApiOperation({
    summary:
      'Crear o actualizar la historia clínica de un paciente (personal o admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Historia clínica creada o actualizada.',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  upsertRecord(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: UpdateMedicalRecordDto,
  ) {
    return this.medicalRecordsService.upsertRecord(id, currentUser, dto);
  }

  @Get(':id/medical-record')
  @Roles('admin', 'health_staff')
  @ApiOperation({
    summary: 'Obtener la historia clínica de un paciente (personal o admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Historia clínica con visitas incluidas.',
  })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  getRecord(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.medicalRecordsService.getRecord(id, currentUser);
  }

  @Post(':id/medical-visits')
  @Roles('admin', 'health_staff')
  @ApiOperation({
    summary:
      'Añadir una visita médica a la historia clínica (personal o admin)',
  })
  @ApiResponse({
    status: 201,
    description: 'Visita añadida a la historia clínica.',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  addVisit(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: CreateMedicalVisitDto,
  ) {
    return this.medicalRecordsService.addVisit(id, currentUser, dto);
  }

  @Get('me/history')
  @Roles('patient')
  @ApiOperation({ summary: 'Obtener mi historial médico completo (paciente)' })
  @ApiResponse({
    status: 200,
    description: 'Historia clínica con todas las visitas.',
  })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  getMyHistory(@CurrentUser() currentUser: JwtPayload) {
    return this.medicalRecordsService.getMyHistory(currentUser.sub);
  }
}
