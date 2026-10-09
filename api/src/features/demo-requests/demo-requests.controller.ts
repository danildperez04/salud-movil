import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { CreateDemoRequestDto } from './dto/create-demo-request.dto';
import { DemoRequestsService } from './demo-requests.service';

/** Formulario público de la landing. */
@ApiTags('demo-requests')
@Controller('demo-requests')
export class DemoRequestsController {
  constructor(private readonly demoRequestsService: DemoRequestsService) {}

  @Public()
  // Mucho más estricto que el límite global: nadie necesita pedir una demo más
  // de unas pocas veces por hora, y cada envío escribe en la base.
  @Throttle({ default: { limit: 5, ttl: 60 * 60_000 } })
  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Enviar una solicitud de demo (formulario público)',
  })
  @ApiResponse({
    status: 201,
    description: 'Solicitud recibida; mensaje de confirmación.',
  })
  @ApiResponse({
    status: 429,
    description: 'Demasiadas solicitudes; esperar una hora.',
  })
  async create(
    @Body() dto: CreateDemoRequestDto,
  ): Promise<{ message: string }> {
    await this.demoRequestsService.createPublic(dto);
    return { message: 'Recibimos tu solicitud. Te contactaremos pronto.' };
  }
}
