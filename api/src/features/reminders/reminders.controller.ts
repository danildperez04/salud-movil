import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';

@Controller('patients')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Get('me/reminders')
  @Roles('patient')
  listForMe(
    @CurrentUser() currentUser: JwtPayload,
    @Query('windowDays') windowDays?: string,
  ) {
    return this.remindersService.listForMe(
      currentUser,
      this.parseWindow(windowDays),
    );
  }

  @Get(':id/reminders')
  @Roles('admin', 'health_staff')
  listForPatient(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtPayload,
    @Query('windowDays') windowDays?: string,
  ) {
    return this.remindersService.listForPatient(
      id,
      currentUser,
      this.parseWindow(windowDays),
    );
  }

  private parseWindow(windowDays?: string): number | undefined {
    if (windowDays === undefined) {
      return undefined;
    }
    const parsed = parseInt(windowDays, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
}
