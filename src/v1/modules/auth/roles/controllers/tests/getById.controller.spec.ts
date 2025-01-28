import { Test, TestingModule } from '@nestjs/testing';
import { GetRoleByIdController } from '../getById.controller';
import { Role } from '../../roles.interface';
import { PermissionsGuard } from '../../../guards/permissions.guard';
import { loggerProviders } from 'src/v1/modules/core/logger/logger.providers';
import { paginatorProviders } from 'src/v1/modules/shared/paginator/providers/paginator.providers';
describe('GetRoleByIdController', () => {
  let controller: GetRoleByIdController;
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
    getOne: jest.fn().mockImplementation((payload) => {
      return mockRolesRepository.findMany(payload);
    }),
  };
  const mockRolesGuard = {
    canActivate(): boolean {
      return true;
    },
  };
  const mockRolesRepository = {
    findMany: jest.fn().mockImplementation((payload) => {
      const role = roles.find((item: any) => {
        return item.id === payload.filter._id;
      });
      return role;
    }),
  };
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GetRoleByIdController],
      providers: [
        { provide: PermissionsGuard, useValue: mockRolesGuard },
        ...loggerProviders,
        ...paginatorProviders,
        { provide: 'ROLES_REPOSITORY', useValue: mockRolesRepository },
        { provide: 'ROLES_SERVICE', useValue: mockRolesService },
      ],
    }).compile();

    controller = app.get<GetRoleByIdController>(GetRoleByIdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('get role with id', () => {
    it('should return this if a role was found with the given id', async () => {
      const result = await controller.get('a');
      expect(result).toEqual({
        message: 'Success',
        payload: expect.any(Object),
      });
      expect(result.payload).toBeInstanceOf(Role);
    });
    it('should return this if no role was found with given id', async () => {
      const result = await controller.get('k');
      expect(result).toEqual({
        message: 'Success',
        payload: undefined,
      });
    });
    it('should execute roles service softDeleteOne method', () => {
      expect(mockRolesService.getOne).toHaveBeenCalled();
    });
  });
});
