import { Test, TestingModule } from '@nestjs/testing';
import { CreatePermissionController } from '../create.controller';
import { PermissionsGuard } from '../../../guards/permissions.guard';
import { loggerProviders } from 'src/v1/modules/core/logger/logger.providers';
import { paginatorProviders } from 'src/v1/modules/shared/paginator/providers/paginator.providers';
describe('CreatePermissionController', () => {
  let controller: CreatePermissionController;

  const mockPermissionsService = {
    create: jest.fn().mockImplementation((payload) => {
      return mockPermissionsRepository.insert(payload);
    }),
  };
  const mockRolesGuard = {
    canActivate(): boolean {
      return true;
    },
  };
  const mockPermissionsRepository = {
    insert: jest.fn().mockImplementation((payload) => ({
      id: Date.now().toString(),
      name: payload.name,
    })),
  };
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CreatePermissionController],
      providers: [
        { provide: PermissionsGuard, useValue: mockRolesGuard },
        ...loggerProviders,
        ...paginatorProviders,
        { provide: 'PERMISSIONS_REPOSITORY', useValue: mockPermissionsRepository },
        { provide: 'PERMISSIONS_SERVICE', useValue: mockPermissionsService },
      ],
    }).compile();

    controller = app.get<CreatePermissionController>(CreatePermissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create permission', () => {
    it('should return a permission', async () => {
      const createPermissionPayload = {
        name: 'my permission',
      };
      const result = await controller.create(createPermissionPayload);
      expect(result).toEqual({
        message: expect.any(String),
        payload: {
          id: expect.any(String),
          name: 'my permission',
        },
      });
    });
    it('should execute permissionsService.create method', () => {
      expect(mockPermissionsService.create).toHaveBeenCalled();
    });
  });
});
