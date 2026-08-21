import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
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
}
