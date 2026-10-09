import {
  Controller,
  Get,
  Header,
  Param,
  ParseEnumPipe,
  StreamableFile,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../../common/decorators/public.decorator';
import { RELEASE_PLATFORMS, type ReleasePlatform } from './release-platform';
import { PublicRelease, ReleasesService } from './releases.service';

/** Parte pública: lo que muestra la landing y la descarga de los instaladores. */
@Controller('releases')
export class ReleasesController {
  constructor(private readonly releasesService: ReleasesService) {}

  @Public()
  @Get('latest')
  // Un minuto de caché basta para que la landing no golpee la base en cada visita.
  @Header('Cache-Control', 'public, max-age=60')
  latest(): Promise<PublicRelease[]> {
    return this.releasesService.findLatestPublished();
  }

  @Public()
  // Un instalable pesa decenas de MB: se limita más que el resto del API.
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @Get(':platform/download')
  async download(
    @Param(
      'platform',
      new ParseEnumPipe(
        Object.fromEntries(RELEASE_PLATFORMS.map((p) => [p, p])),
        {
          errorHttpStatusCode: 404,
        },
      ),
    )
    platform: ReleasePlatform,
  ): Promise<StreamableFile> {
    const file = await this.releasesService.openLatest(platform);
    return new StreamableFile(file.stream, {
      type: file.mimeType,
      length: file.sizeBytes,
      disposition: `attachment; filename="${file.fileName}"`,
    });
  }
}
