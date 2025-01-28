import { Test, TestingModule } from '@nestjs/testing';
import { GetUsersController } from '../getAll.controller';
import { UsersService } from '../../services/users.service';
import { User } from '../../users.interface';
import { PermissionsGuard } from 'src/v1/modules/auth/guards/permissions.guard';
import { loggerProviders } from 'src/v1/modules/core/logger/logger.providers';
import { queryParserProviders } from 'src/v1/modules/shared/queryParser/providers/queryParser.providers';
import { Request } from 'express';
import { paginatorProviders } from 'src/v1/modules/shared/paginator/providers/paginator.providers';
describe('GetUsersController', () => {
  let controller: GetUsersController;

  const mockUsersService = {
    getAll: jest.fn().mockImplementation(() => {
      const user = new User();
      user.firstName = 'John';
      user.lastName = 'Doe';
      user.fullName = 'John Doe';
      user.email = 'joghndoe.com';
      user.username = 'John dUDE';
      return {
        metadata: {
          total_items: 1,
          rows_per_page: 1,
          current_page: 1,
          last_page: 1,
          next: { page: 1, limit: 1 },
          previous: { page: 1, limit: 1 },
        },
        payload: [user],
      };
    }),
  };
  const mockRolesGuard = {
    canActivate(): boolean {
      return true;
    },
  };
  const mockUsersRolesRepository = {};
  const mockUsersRepository = {};
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GetUsersController],
      providers: [
        UsersService,
        { provide: PermissionsGuard, useValue: mockRolesGuard },
        ...loggerProviders,
        { provide: 'USERS_ROLES_REPOSITORY', useValue: mockUsersRolesRepository },
        { provide: 'USERS_REPOSITORY', useValue: mockUsersRepository },
        ...queryParserProviders,
        ...paginatorProviders,
        { provide: 'USERS_SERVICE', useValue: mockUsersService },
      ],
    }).compile();

    controller = app.get<GetUsersController>(GetUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('get users', () => {
    it('should return An Array', async () => {
      const mockRequest = {
        query: [],
        url: '',
      };
      const result = await controller.getUsers(mockRequest as unknown as Request);
      expect(result).toEqual(expect.any(Object));
      result.payload.forEach((element) => {
        expect(element).toBeInstanceOf(User);
      });
    });
    it('should execute UsersService.getAll method', () => {
      expect(mockUsersService.getAll).toHaveBeenCalled();
    });
  });
});
