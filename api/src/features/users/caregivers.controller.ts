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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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

@ApiTags('users')
@ApiBearerAuth()
@Controller('caregivers')
@Roles('admin', 'health_staff')
export class CaregiversController {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly caregiversService: CaregiversService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Buscar cuidadores por nombre, email, usuario o DNI',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de cuidadores que coinciden.',
  })
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
  @ApiOperation({ summary: 'Obtener un cuidador por su ID' })
  @ApiResponse({ status: 200, description: 'Datos completos del cuidador.' })
  @ApiResponse({ status: 404, description: 'Cuidador no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.caregiversService.findOne(id);
  }

  @Get(':id/patients')
  @ApiOperation({ summary: 'Listar pacientes vinculados a un cuidador' })
  @ApiResponse({ status: 200, description: 'Pacientes del cuidador.' })
  @ApiResponse({ status: 404, description: 'Cuidador no encontrado.' })
  findPatients(@Param('id') id: string) {
    return this.caregiversService.findPatients(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear una cuenta de cuidador (admin o personal de salud)',
  })
  @ApiResponse({ status: 201, description: 'Cuenta de cuidador creada.' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o municipio no encontrado.',
  })
  @ApiResponse({ status: 409, description: 'Correo, usuario o DNI ya en uso.' })
  create(@Body() dto: CreateCaregiverDto) {
    return this.caregiversService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de un cuidador' })
  @ApiResponse({ status: 200, description: 'Cuidador actualizado.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 404, description: 'Cuidador no encontrado.' })
  @ApiResponse({ status: 409, description: 'Correo, usuario o DNI ya en uso.' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.caregiversService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un cuidador (soft delete)' })
  @ApiResponse({ status: 200, description: 'Cuidador marcado como eliminado.' })
  @ApiResponse({ status: 404, description: 'Cuidador no encontrado.' })
  remove(@Param('id') id: string) {
    return this.caregiversService.remove(id);
  }
}
