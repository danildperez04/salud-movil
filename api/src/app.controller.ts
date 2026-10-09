import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@ApiTags('system')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Endpoint raíz informativo' })
  @ApiResponse({ status: 200, description: 'Mensaje de bienvenida.' })
  getHello(): string {
    return this.appService.getHello();
  }
}
