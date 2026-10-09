import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminDemoRequestsController } from './admin-demo-requests.controller';
import { DemoRequestsController } from './demo-requests.controller';
import { DemoRequestsService } from './demo-requests.service';
import { DemoRequest } from './entities/demo-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DemoRequest])],
  controllers: [DemoRequestsController, AdminDemoRequestsController],
  providers: [DemoRequestsService],
})
export class DemoRequestsModule {}
