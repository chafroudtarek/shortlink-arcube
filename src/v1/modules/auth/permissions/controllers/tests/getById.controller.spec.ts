import { Test, TestingModule } from '@nestjs/testing';
import { GetPermissionByIdController } from '../getById.controller';
import { Permission } from '../../permissions.interface';
import { PermissionsGuard } from '../../../guards/permissions.guard';
import { loggerProviders } from 'src/v1/modules/core/logger/logger.providers';
import { paginatorProviders } from 'src/v1/modules/shared/paginator/providers/paginator.providers';
describe('GetPermissionByIdController', () => {
  let controller: GetPermissionByIdController;
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
    getOne: jest.fn().mockImplementation((payload) => {
      return mockPermissionsRepository.findMany(payload);
    }),
  };
  const mockRolesGuard = {
    canActivate(): boolean {
      return true;
    },
  };
  const mockPermissionsRepository = {
    findMany: jest.fn().mockImplementation((payload) => {
      const permission = permissions.find((item: any) => {
        return item.id === payload.filter._id;
      });
      return permission;
    }),
  };
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GetPermissionByIdController],
      providers: [
        { provide: PermissionsGuard, useValue: mockRolesGuard },
        ...loggerProviders,
        ...paginatorProviders,
        { provide: 'PERMISSIONS_REPOSITORY', useValue: mockPermissionsRepository },
        { provide: 'PERMISSIONS_SERVICE', useValue: mockPermissionsService },
      ],
    }).compile();

    controller = app.get<GetPermissionByIdController>(GetPermissionByIdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('get permission by id', () => {
    it('should return this if a permission was found with the given id', async () => {
      const result = await controller.get('a');
      expect(result).toEqual({
        message: 'Success',
        payload: expect.any(Object),
      });
      expect(result.payload).toBeInstanceOf(Permission);
    });
    it('should return this if no permission was found with given id', async () => {
      const result = await controller.get('k');
      expect(result).toEqual({
        message: 'Success',
        payload: undefined,
      });
    });
    it('should execute permissionsService.softDeleteOne method', () => {
      expect(mockPermissionsService.getOne).toHaveBeenCalled();
    });
  });
});
