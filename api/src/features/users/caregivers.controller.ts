import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CaregiversService } from './caregivers.service';
import { CreateCaregiverDto } from './dto/create-caregiver.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../../common/decorators/roles.decorator';

export interface PublicCaregiver {
  id: string;
  name: string;
  email: string;
  username: string;
  phoneNumber: string;
  dni: string | null;
}

@Controller('caregivers')
@Roles('admin', 'health_staff')
export class CaregiversController {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly caregiversService: CaregiversService,
  ) {}

  @Get()
  async search(@Query('q') q?: string): Promise<PublicCaregiver[]> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.caregiver', 'caregiver')
      .leftJoin('user.role', 'role')
      .where('role.code = :role', { role: 'caregiver' })
      .orderBy('user.name', 'ASC');

    if (q && q.trim().length > 0) {
      const term = `%${q.trim()}%`;
      query.andWhere(
        '(user.name ILIKE :term OR user.email ILIKE :term OR user.username ILIKE :term OR user.dni ILIKE :term)',
        { term },
      );
    }

    const users = await query.getMany();
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      phoneNumber: user.phoneNumber,
      dni: user.dni ?? null,
    }));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.caregiversService.findOne(id);
  }

  @Get(':id/patients')
  findPatients(@Param('id') id: string) {
    return this.caregiversService.findPatients(id);
  }

  @Post()
  create(@Body() dto: CreateCaregiverDto) {
    return this.caregiversService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.caregiversService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.caregiversService.remove(id);
  }
}
