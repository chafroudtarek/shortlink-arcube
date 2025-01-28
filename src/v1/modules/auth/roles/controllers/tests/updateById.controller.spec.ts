import { Test, TestingModule } from '@nestjs/testing';
import { UpdateRoleByIdController } from '../updateById.controller';
import { Role } from '../../roles.interface';
import { PermissionsGuard } from '../../../guards/permissions.guard';
import { loggerProviders } from 'src/v1/modules/core/logger/logger.providers';
import { paginatorProviders } from 'src/v1/modules/shared/paginator/providers/paginator.providers';
describe('UpdateRoleByIdController', () => {
  let controller: UpdateRoleByIdController;
  const role1 = new Role();
  const role2 = new Role();
  const role3 = new Role();
  role1.id = 'a';
  role1.name = 'role1';
  role2.id = 'b';
  role2.name = 'role2';
  role3.id = 'c';
  role3.name = 'role3';
  const roles = [role1, role2, role3];
  const mockRolesService = {
    update: jest.fn().mockImplementation((options, payload) => {
      return mockRolesRepository.updateMany(options, payload);
    }),
  };
  const mockRolesGuard = {
    canActivate(): boolean {
      return true;
    },
  };
  const mockRolesRepository = {
    updateMany: jest.fn().mockImplementation((options) => {
      const updatedCount = roles.reduce((numUpdated: number, item: any) => {
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
      controllers: [UpdateRoleByIdController],
      providers: [
        { provide: PermissionsGuard, useValue: mockRolesGuard },
        ...loggerProviders,
        ...paginatorProviders,
        { provide: 'ROLES_REPOSITORY', useValue: mockRolesRepository },
        { provide: 'ROLES_SERVICE', useValue: mockRolesService },
      ],
    }).compile();

    controller = app.get<UpdateRoleByIdController>(UpdateRoleByIdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('update role with id', () => {
    it('should return this if a role was found with the given id', async () => {
      const result = await controller.update('a', { name: 'newrolename' });
      expect(result).toEqual({
        message: 'Success',
        payload: {
          modifiedCount: 1,
        },
      });
    });
    it('should return this if no role was found with given id', async () => {
      const result = await controller.update('k', { name: 'newrolename' });
      expect(result).toEqual({
        message: 'Success',
        payload: {
          modifiedCount: 0,
        },
      });
    });
    it('should execute roles service update method', () => {
      expect(mockRolesService.update).toHaveBeenCalled();
    });
  });
});
