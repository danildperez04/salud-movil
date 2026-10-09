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
@Controller('admin/releases')
@Roles('admin')
export class AdminReleasesController {
  constructor(private readonly releasesService: ReleasesService) {}

  @Get()
  findAll(): Promise<AppRelease[]> {
    return this.releasesService.findAll();
  }

  @Post()
  // El orden importa: la limpieza envuelve la validación y el servicio.
  @UseInterceptors(
    FileInterceptor('file', releaseUploadOptions),
    CleanupUploadInterceptor,
  )
  create(
    @Body() dto: CreateReleaseDto,
    @UploadedFile() file: UploadedReleaseFile | undefined,
    @CurrentUser() user: JwtPayload,
  ): Promise<AppRelease> {
    return this.releasesService.create(dto, file, user.sub);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateReleaseDto,
  ): Promise<AppRelease> {
    return this.releasesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.releasesService.remove(id);
  }
}
