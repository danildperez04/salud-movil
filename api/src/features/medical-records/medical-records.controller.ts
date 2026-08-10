import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';
import { CreateMedicalVisitDto } from './dto/create-medical-visit.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

@Controller('patients')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Put(':id/medical-record')
  @Roles('admin', 'health_staff')
  upsertRecord(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: UpdateMedicalRecordDto,
  ) {
    return this.medicalRecordsService.upsertRecord(id, currentUser, dto);
  }

  @Get(':id/medical-record')
  @Roles('admin', 'health_staff')
  getRecord(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.medicalRecordsService.getRecord(id, currentUser);
  }

  @Post(':id/medical-visits')
  @Roles('admin', 'health_staff')
  addVisit(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: CreateMedicalVisitDto,
  ) {
    return this.medicalRecordsService.addVisit(id, currentUser, dto);
  }

  @Get('me/history')
  @Roles('patient')
  getMyHistory(@CurrentUser() currentUser: JwtPayload) {
    return this.medicalRecordsService.getMyHistory(currentUser.sub);
  }
}
