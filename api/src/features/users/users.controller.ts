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
import { UsersService } from './users.service';
import { CreateHealthStaffDto } from './dto/create-health-staff.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@Roles('admin')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un miembro del personal de salud (admin)' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado con su rol y centro de salud.',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o centro/rol no encontrado.',
  })
  @ApiResponse({ status: 409, description: 'Correo, usuario o DNI ya en uso.' })
  create(@Body() dto: CreateHealthStaffDto) {
    return this.usersService.createHealthStaff(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar usuarios con filtro opcional por rol' })
  @ApiResponse({ status: 200, description: 'Listado paginado de usuarios.' })
  findAll(@Query() query: ListUsersQueryDto) {
    return this.usersService.findAll(query.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario con su rol, municipio y centro si aplica.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de un usuario (admin)' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiResponse({ status: 409, description: 'Correo, usuario o DNI ya en uso.' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario (soft delete)' })
  @ApiResponse({ status: 200, description: 'Usuario marcado como eliminado.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
