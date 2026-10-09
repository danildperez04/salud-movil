import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { ListDemoRequestsQueryDto } from './dto/list-demo-requests-query.dto';
import { UpdateDemoRequestDto } from './dto/update-demo-request.dto';
import { DemoRequest } from './entities/demo-request.entity';
import {
  DemoRequestPage,
  DemoRequestStats,
  DemoRequestsService,
} from './demo-requests.service';

/** Gestión de solicitudes. Solo administradores. */
@Controller('admin/demo-requests')
@Roles('admin')
export class AdminDemoRequestsController {
  constructor(private readonly demoRequestsService: DemoRequestsService) {}

  @Get()
  findAll(@Query() query: ListDemoRequestsQueryDto): Promise<DemoRequestPage> {
    return this.demoRequestsService.findAll(query);
  }

  // Antes de `:id`, para que "stats" no se interprete como un id.
  @Get('stats')
  stats(): Promise<DemoRequestStats> {
    return this.demoRequestsService.stats();
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDemoRequestDto,
  ): Promise<DemoRequest> {
    return this.demoRequestsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.demoRequestsService.remove(id);
  }
}
