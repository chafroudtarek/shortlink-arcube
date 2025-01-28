import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsGuard } from '../permissions.guard';
import { loggerProviders } from 'src/v1/modules/core/logger/logger.providers';
describe('PermisionsGuard', () => {
  let guard: PermissionsGuard;
  let reflector: Reflector;

  const mockUsersRepository = {
    doesUserHavePermission: jest.fn().mockImplementation(() => false),
    findOne: jest.fn().mockImplementation(() => {
      return Promise.resolve({
        id: 1,
        firstName: 'tarek',
        lastName: 'chafroud',
        roles: [
          {
            id: 1,
            name: 'admin',
            permissions: [
              {
                id: 1,
                name: 'getUsers',
              },
            ],
          },
        ],
      });
    }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsGuard,
        ...loggerProviders,
        { provide: 'USERS_REPOSITORY', useValue: mockUsersRepository },
        Reflector,
      ],
    }).compile();

    guard = app.get<PermissionsGuard>(PermissionsGuard);
    reflector = app.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
  describe('canActivate', () => {
    it('should allow access when user has required permission', async () => {
      const mockExecutionContext = {
        switchToHttp: jest.fn().mockReturnThis(),
        getHandler: jest.fn().mockReturnValue({}),
        getRequest: jest.fn().mockReturnValue({
          user: {
            roles: ['admin', 'user'],
          },
        }),
      };
      const requiredPermission = ['getUsers'];
      mockUsersRepository.doesUserHavePermission = jest.fn().mockImplementation(() => true);
      jest.spyOn(reflector, 'get').mockReturnValue(requiredPermission);

      const result = await guard.canActivate(mockExecutionContext as unknown as ExecutionContext);

      expect(result).toBe(true);
    });
  });
  it('should not allow access when user doesnt have the required permission', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getHandler: jest.fn().mockReturnValue({}),
      getRequest: jest.fn().mockReturnValue({
        user: {
          roles: ['admin', 'user'],
        },
      }),
    };
    const requiredPermission = ['getAdmins'];
    jest.spyOn(reflector, 'get').mockReturnValue(requiredPermission);
    mockUsersRepository.doesUserHavePermission = jest.fn().mockImplementation(() => false);

    const result = await guard.canActivate(mockExecutionContext as unknown as ExecutionContext);

    expect(result).toBe(false);
  });
});
