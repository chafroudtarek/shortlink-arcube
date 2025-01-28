import { Test, TestingModule } from '@nestjs/testing';
import { Permission } from '../../permissions.interface';
import { UpdatePermissionByIdController } from '../updateById.controller';
import { PermissionsGuard } from '../../../guards/permissions.guard';
import { loggerProviders } from 'src/v1/modules/core/logger/logger.providers';
import { paginatorProviders } from 'src/v1/modules/shared/paginator/providers/paginator.providers';
describe('UpdatePermissionByIdController', () => {
  let controller: UpdatePermissionByIdController;
  const permission1 = new Permission();
  const permission2 = new Permission();
  const permission3 = new Permission();
  permission1.id = 'a';
  permission1.name = 'permission1';
  permission2.id = 'b';
  permission2.name = 'permission2';
  permission3.id = 'c';
  permission3.name = 'permission3';
  const permissions = [permission1, permission2, permission3];
  const mockPermissionsService = {
    update: jest.fn().mockImplementation((options, payload) => {
      return mockPermissionsRepository.updateMany(options, payload);
    }),
  };
  const mockRolesGuard = {
    canActivate(): boolean {
      return true;
    },
  };
  const mockPermissionsRepository = {
    updateMany: jest.fn().mockImplementation((options) => {
      const updatedCount = permissions.reduce((numUpdated: number, item: any) => {
        if (options.filter._id === item.id) {
          numUpdated += 1;
        }
        return numUpdated;
      }, 0);
      return updatedCount;
    }),
  };
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UpdatePermissionByIdController],
      providers: [
        { provide: PermissionsGuard, useValue: mockRolesGuard },
        ...loggerProviders,
        ...paginatorProviders,
        { provide: 'PERMISSIONS_REPOSITORY', useValue: mockPermissionsRepository },
        { provide: 'PERMISSIONS_SERVICE', useValue: mockPermissionsService },
      ],
    }).compile();

    controller = app.get<UpdatePermissionByIdController>(UpdatePermissionByIdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('update permission by id', () => {
    it('should return this if a permission was found with the given id', async () => {
      const result = await controller.update('a', { name: 'newpermissionname' });
      expect(result).toEqual({
        message: 'Success',
        payload: {
          modifiedCount: 1,
        },
      });
    });
    it('should return this if no permission was found with given id', async () => {
      const result = await controller.update('k', { name: 'newpermissionname' });
      expect(result).toEqual({
        message: 'Success',
        payload: {
          modifiedCount: 0,
        },
      });
    });
    it('should execute permissionsService.softDeleteOne method', () => {
      expect(mockPermissionsService.update).toHaveBeenCalled();
    });
  });
});
