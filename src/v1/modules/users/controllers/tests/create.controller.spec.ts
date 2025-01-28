import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../services/users.service';
import { CreateUserController } from '../create.controller';
import { PermissionsGuard } from 'src/v1/modules/auth/guards/permissions.guard';
import { loggerProviders } from 'src/v1/modules/core/logger/logger.providers';
import { paginatorProviders } from 'src/v1/modules/shared/paginator/providers/paginator.providers';
describe('CreateUserController', () => {
  let controller: CreateUserController;

  const mockUsersService = {
    createUser: jest.fn().mockImplementation((payload) => {
      return mockUsersRepository.insert(payload);
    }),
  };
  const mockRolesGuard = {
    canActivate(): boolean {
      return true;
    },
  };
  const mockUsersRolesRepository = {};
  const mockUsersRepository = {
    insert: jest.fn().mockImplementation((payload) => ({
      id: Date.now(),
      age: null,
      birthDate: null,
      fullName: payload?.firstName + ' ' + payload?.lastName,
      ...payload,
    })),
  };
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CreateUserController],
      providers: [
        UsersService,
        { provide: PermissionsGuard, useValue: mockRolesGuard },
        ...loggerProviders,
        ...paginatorProviders,
        { provide: 'USERS_ROLES_REPOSITORY', useValue: mockUsersRolesRepository },
        { provide: 'USERS_REPOSITORY', useValue: mockUsersRepository },
        { provide: 'USERS_SERVICE', useValue: mockUsersService },
      ],
    }).compile();

    controller = app.get<CreateUserController>(CreateUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create user', () => {
    it('should return a user', async () => {
      const createUserPayload = {
        firstName: 'John',
        lastName: 'Doe',
        password: '123153412qwq',
        email: 'joghndoe.com',
        username: 'John dUDE',
        verify_password: '1233425tgde',
        picture: null,
      };
      const result = await controller.createUser(createUserPayload);
      expect(result).toEqual({
        message: expect.any(String),
        payload: {
          id: expect.any(Number),
          age: null,
          birthDate: null,
          fullName: createUserPayload.firstName + ' ' + createUserPayload.lastName,
          ...createUserPayload,
        },
      });
    });
    it('should execute UsersService.createUser method', () => {
      expect(mockUsersService.createUser).toHaveBeenCalled();
    });
  });
});
