import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import type { JwtPayload } from '../../common/guards/jwt-payload.interface';
import { CleanupUploadInterceptor } from './cleanup-upload.interceptor';
import { CreateReleaseDto } from './dto/create-release.dto';
import { UpdateReleaseDto } from './dto/update-release.dto';
import { AppRelease } from './entities/app-release.entity';
import { releaseUploadOptions } from './release-upload';
import { ReleasesService } from './releases.service';
import type { UploadedFile as UploadedReleaseFile } from './releases.service';

/** Gestión de instaladores. Solo administradores. */
@ApiTags('releases')
@ApiBearerAuth()
@Controller('admin/releases')
@Roles('admin')
export class AdminReleasesController {
  constructor(private readonly releasesService: ReleasesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los instaladores (admin)' })
  @ApiResponse({ status: 200, description: 'Lista completa de instaladores.' })
  findAll(): Promise<AppRelease[]> {
    return this.releasesService.findAll();
  }

  @Post()
  // El orden importa: la limpieza envuelve la validación y el servicio.
  @UseInterceptors(
    FileInterceptor('file', releaseUploadOptions),
    CleanupUploadInterceptor,
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo del instalador + metadatos',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        version: { type: 'string', example: '1.2.0' },
        platform: {
          type: 'string',
          enum: ['android', 'ios', 'windows', 'macos', 'linux'],
        },
        channel: { type: 'string', enum: ['stable', 'beta', 'alpha'] },
        isPublished: { type: 'boolean', default: false },
        changelog: { type: 'string', example: 'Corrección de bugs y mejoras.' },
      },
      required: ['file', 'version', 'platform', 'channel'],
    },
  })
  @ApiOperation({ summary: 'Subir un nuevo instalador (admin)' })
  @ApiResponse({ status: 201, description: 'Instalador subido y registrado.' })
  @ApiResponse({
    status: 400,
    description: 'Archivo inválido, faltan metadatos o versión duplicada.',
  })
  create(
    @Body() dto: CreateReleaseDto,
    @UploadedFile() file: UploadedReleaseFile | undefined,
    @CurrentUser() user: JwtPayload,
  ): Promise<AppRelease> {
    return this.releasesService.create(dto, file, user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar metadatos de un instalador (admin)' })
  @ApiResponse({ status: 200, description: 'Instalador actualizado.' })
  @ApiResponse({ status: 404, description: 'Instalador no encontrado.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateReleaseDto,
  ): Promise<AppRelease> {
    return this.releasesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar un instalador (admin)' })
  @ApiResponse({ status: 204, description: 'Instalador eliminado.' })
  @ApiResponse({ status: 404, description: 'Instalador no encontrado.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.releasesService.remove(id);
  }
}
