import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminReleasesController } from './admin-releases.controller';
import { AppRelease } from './entities/app-release.entity';
import { releaseStorage } from './release-upload';
import { ReleaseStorage } from './release-storage';
import { ReleasesController } from './releases.controller';
import { ReleasesService } from './releases.service';

@Module({
  imports: [TypeOrmModule.forFeature([AppRelease])],
  controllers: [ReleasesController, AdminReleasesController],
  providers: [
    ReleasesService,
    // Para guardar en S3/Supabase: otra subclase de ReleaseStorage aquí. La
    // subida a disco local (multer) vive en release-upload.ts.
    { provide: ReleaseStorage, useValue: releaseStorage },
  ],
})
export class ReleasesModule {}
