import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { GetPermissionsController } from '../getAll.controller';
import { Permission } from '../../permissions.interface';
import { PermissionsGuard } from '../../../guards/permissions.guard';
import { loggerProviders } from 'src/v1/modules/core/logger/logger.providers';
import { queryParserProviders } from 'src/v1/modules/shared/queryParser/providers/queryParser.providers';
import { paginatorProviders } from 'src/v1/modules/shared/paginator/providers/paginator.providers';
describe('GetPermissionsController', () => {
  let controller: GetPermissionsController;

  const mockPermissionsService = {
    getAll: jest.fn().mockImplementation(() => {
      const permission = new Permission();
      permission.id = 'edj33i2dd';
      permission.name = 'permission';
      return {
        metadata: {
          total_items: 1,
          rows_per_page: 1,
          current_page: 1,
          last_page: 1,
          next: { page: 1, limit: 1 },
          previous: { page: 1, limit: 1 },
        },
        payload: [permission],
      };
    }),
  };
  const mockRolesGuard = {
    canActivate(): boolean {
      return true;
    },
  };
  const mockPermissionsRepository = {};
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GetPermissionsController],
      providers: [
        { provide: PermissionsGuard, useValue: mockRolesGuard },
        ...loggerProviders,
        { provide: 'PERMISSIONS_REPOSITORY', useValue: mockPermissionsRepository },
        ...queryParserProviders,
        ...paginatorProviders,
        { provide: 'PERMISSIONS_SERVICE', useValue: mockPermissionsService },
      ],
    }).compile();

    controller = app.get<GetPermissionsController>(GetPermissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('get permissions', () => {
    it('should return An Array', async () => {
      const mockRequest = {
        query: [],
        url: '',
      };
      const result = await controller.get(mockRequest as unknown as Request);
      expect(result).toEqual(expect.any(Object));
      result.payload.payload.forEach((element) => {
        expect(element).toBeInstanceOf(Permission);
      });
    });
    it('should execute permissions service getAll method', () => {
      expect(mockPermissionsService.getAll).toHaveBeenCalled();
    });
  });
});
