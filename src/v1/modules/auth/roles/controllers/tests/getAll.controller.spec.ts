import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { GetRolesController } from '../getAll.controller';
import { Role } from '../../roles.interface';
import { PermissionsGuard } from '../../../guards/permissions.guard';
import { loggerProviders } from 'src/v1/modules/core/logger/logger.providers';
import { queryParserProviders } from 'src/v1/modules/shared/queryParser/providers/queryParser.providers';
import { paginatorProviders } from 'src/v1/modules/shared/paginator/providers/paginator.providers';

describe('GetRolesController', () => {
  let controller: GetRolesController;

  const mockRolesService = {
    getAll: jest.fn().mockImplementation(() => {
      const role = new Role();
      role.id = 'edj33i2dd';
      role.name = 'role';
      return {
        metadata: {
          total_items: 1,
          rows_per_page: 1,
          current_page: 1,
          last_page: 1,
          next: { page: 1, limit: 1 },
          previous: { page: 1, limit: 1 },
        },
        payload: [role],
      };
    }),
  };
  const mockRolesGuard = {
    canActivate(): boolean {
      return true;
    },
  };
  const mockRolesRepository = {};
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GetRolesController],
      providers: [
        { provide: PermissionsGuard, useValue: mockRolesGuard },
        ...loggerProviders,
        { provide: 'ROLES_REPOSITORY', useValue: mockRolesRepository },
        ...queryParserProviders,
        ...paginatorProviders,
        { provide: 'ROLES_SERVICE', useValue: mockRolesService },
      ],
    }).compile();

    controller = app.get<GetRolesController>(GetRolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('get roles', () => {
    it('should return An Array', async () => {
      const mockRequest = {
        query: [],
        url: '',
      };
      const result = await controller.get(mockRequest as unknown as Request);
      expect(result).toEqual(expect.any(Object));
      result.payload.payload.forEach((element) => {
        expect(element).toBeInstanceOf(Role);
      });
    });
    it('should execute UsersService.getAll method', () => {
      expect(mockRolesService.getAll).toHaveBeenCalled();
    });
  });
});
