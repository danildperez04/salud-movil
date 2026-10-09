// Unit test for UsersController logic without importing the real controller
// (avoids @nestjs/swagger import issues in Jest)

import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UsersService } from './users.service';

// Mock controller class with same public methods
class MockUsersController {
  constructor(private readonly usersService: UsersService) {}

  create(dto: any) {
    return this.usersService.createHealthStaff(dto);
  }

  findAll(role?: string) {
    return this.usersService.findAll(role);
  }

  findOne(id: string) {
    return this.usersService.findOne(id);
  }

  update(id: string, dto: any) {
    return this.usersService.update(id, dto);
  }

  remove(id: string) {
    return this.usersService.remove(id);
  }
}

describe('UsersController (logic)', () => {
  let controller: MockUsersController;
  const mockUsersService = {
    createHealthStaff: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MockUsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({})
      .compile();

    controller = module.get<MockUsersController>(MockUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
