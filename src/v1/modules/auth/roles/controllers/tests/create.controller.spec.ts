import { Test, TestingModule } from '@nestjs/testing';
import { CreateRoleController } from '../create.controller';
import { PermissionsGuard } from '../../../guards/permissions.guard';
import { loggerProviders } from 'src/v1/modules/core/logger/logger.providers';
import { paginatorProviders } from 'src/v1/modules/shared/paginator/providers/paginator.providers';
import {
  ROLES_REPO_PROVIDER_NAME,
  USERS_REPO_PROVIDER_NAME,
} from 'src/v1/modules/database/providers.constants';
import { ROLES_SERVICE_PROVIDER_NAME } from '../../../providers.constants';
describe('CreateRoleController', () => {
  let controller: CreateRoleController;

  const mockRolesService = {
    create: jest.fn().mockImplementation((payload) => {
      return mockRolesRepository.insert(payload);
    }),
  };
  const mockRolesGuard = {
    canActivate(): boolean {
      return true;
    },
  };
  const mockRolesRepository = {
    insert: jest.fn().mockImplementation((payload) => ({
      id: Date.now().toString(),
      name: payload.name,
    })),
  };
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CreateRoleController],
      providers: [
        { provide: PermissionsGuard, useValue: mockRolesGuard },
        ...loggerProviders,
        ...paginatorProviders,
        { provide: ROLES_REPO_PROVIDER_NAME, useValue: mockRolesRepository },
        { provide: ROLES_SERVICE_PROVIDER_NAME, useValue: mockRolesService },
        { provide: USERS_REPO_PROVIDER_NAME, useValue: {} },
      ],
    }).compile();

    controller = app.get<CreateRoleController>(CreateRoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create roles', () => {
    it('should return a role', async () => {
      const createRolePayload = {
        name: 'my role',
      };
      const result = await controller.create(createRolePayload);
      expect(result).toEqual({
        message: expect.any(String),
        payload: {
          id: expect.any(String),
          name: 'my role',
        },
      });
    });
    it('should execute roles service create method', () => {
      expect(mockRolesService.create).toHaveBeenCalled();
    });
  });
});
