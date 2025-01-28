import { Test, TestingModule } from '@nestjs/testing';
import { DeleteRoleByIdController } from '../delete.controller';
import { loggerProviders } from 'src/v1/modules/core/logger/logger.providers';
import { PermissionsGuard } from '../../../guards/permissions.guard';
import { paginatorProviders } from 'src/v1/modules/shared/paginator/providers/paginator.providers';
describe('DeleteRoleByIdController', () => {
  let controller: DeleteRoleByIdController;
  const roles = [
    {
      id: 'a',
      name: 'role1',
    },
    {
      id: 'b',
      name: 'role2',
    },
    {
      id: 'c',
      name: 'role3',
    },
  ];
  const mockRolesService = {
    softDeleteOne: jest.fn().mockImplementation((payload) => {
      return mockRolesRepository.softDelete(payload);
    }),
  };
  const mockRolesGuard = {
    canActivate(): boolean {
      return true;
    },
  };
  const mockRolesRepository = {
    softDelete: jest.fn().mockImplementation((payload) => {
      const foundCount = roles.reduce((numFound: number, item: any) => {
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
      controllers: [DeleteRoleByIdController],
      providers: [
        { provide: PermissionsGuard, useValue: mockRolesGuard },
        ...loggerProviders,
        ...paginatorProviders,
        { provide: 'ROLES_REPOSITORY', useValue: mockRolesRepository },
        { provide: 'ROLES_SERVICE', useValue: mockRolesService },
      ],
    }).compile();

    controller = app.get<DeleteRoleByIdController>(DeleteRoleByIdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('delete role by id', () => {
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
    it('should execute roles service softDeleteOne method', () => {
      expect(mockRolesService.softDeleteOne).toHaveBeenCalled();
    });
  });
});
