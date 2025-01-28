import { Test, TestingModule } from '@nestjs/testing';
import { DeletePermissionByIdController } from '../delete.controller';
import { PermissionsGuard } from '../../../guards/permissions.guard';
import { loggerProviders } from 'src/v1/modules/core/logger/logger.providers';
import { paginatorProviders } from 'src/v1/modules/shared/paginator/providers/paginator.providers';
describe('DeletePermissionByIdController', () => {
  let controller: DeletePermissionByIdController;
  const permissions = [
    {
      id: 'a',
      name: 'permission1',
    },
    {
      id: 'b',
      name: 'permission1',
    },
    {
      id: 'c',
      name: 'permission1',
    },
  ];
  const mockPermissionsService = {
    softDeleteOne: jest.fn().mockImplementation((payload) => {
      return mockPermissionsRepository.softDelete(payload);
    }),
  };
  const mockRolesGuard = {
    canActivate(): boolean {
      return true;
    },
  };
  const mockPermissionsRepository = {
    softDelete: jest.fn().mockImplementation((payload) => {
      const foundCount = permissions.reduce((numFound: number, item: any) => {
        if (item.id === payload.filter._id) {
          numFound += 1;
        }
        return numFound;
      }, 0);
      return foundCount;
    }),
  };
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DeletePermissionByIdController],
      providers: [
        { provide: PermissionsGuard, useValue: mockRolesGuard },
        ...loggerProviders,
        ...paginatorProviders,
        { provide: 'PERMISSIONS_REPOSITORY', useValue: mockPermissionsRepository },
        { provide: 'PERMISSIONS_SERVICE', useValue: mockPermissionsService },
      ],
    }).compile();

    controller = app.get<DeletePermissionByIdController>(DeletePermissionByIdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('delete permission by id', () => {
    it('should return a number of deleted elements which is 1 in this case', async () => {
      const result = await controller.delete('a');
      expect(result).toEqual({
        message: 'Success',
        payload: { deletedCount: 1 },
      });
    });
    it('should return a number of deleted elements which is 0 in this case', async () => {
      const result = await controller.delete('k');
      expect(result).toEqual({
        message: 'Success',
        payload: { deletedCount: 0 },
      });
    });
    it('should execute permissionsService.softDeleteOne method', () => {
      expect(mockPermissionsService.softDeleteOne).toHaveBeenCalled();
    });
  });
});
