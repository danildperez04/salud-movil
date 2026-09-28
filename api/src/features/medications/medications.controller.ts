import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

@Controller('patients')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  // === Paciente (HU-24/26) ===

  @Get('me/medications')
  @Roles('patient')
  listForMe(@CurrentUser() currentUser: JwtPayload) {
    return this.medicationsService.listForMe(currentUser);
  }

  @Post('me/medications/:medicationId/reminders/:reminderId/confirm')
  @Roles('patient')
  confirmReminder(
    @Param('medicationId') medicationId: string,
    @Param('reminderId') reminderId: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.medicationsService.confirmReminder(
      currentUser,
      medicationId,
      reminderId,
    );
  }

  // === Personal / Admin (HU-21/22/23) ===

  @Post(':id/medications')
  @Roles('admin', 'health_staff')
  create(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: CreateMedicationDto,
  ) {
    return this.medicationsService.create(id, currentUser, dto);
  }

  @Get(':id/medications')
  @Roles('admin', 'health_staff')
  list(@Param('id') id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.medicationsService.list(id, currentUser);
  }

  @Patch(':id/medications/:medicationId')
  @Roles('admin', 'health_staff')
  update(
    @Param('id') id: string,
    @Param('medicationId') medicationId: string,
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: UpdateMedicationDto,
  ) {
    return this.medicationsService.update(id, medicationId, currentUser, dto);
  }

  @Delete(':id/medications/:medicationId')
  @Roles('admin', 'health_staff')
  remove(
    @Param('id') id: string,
    @Param('medicationId') medicationId: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.medicationsService.remove(id, medicationId, currentUser);
  }
}
