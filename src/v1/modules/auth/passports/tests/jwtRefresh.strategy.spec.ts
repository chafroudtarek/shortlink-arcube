import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { RefreshJwtStrategy } from '../jwtRefresh.strategy';
import { User } from 'src/v1/modules/users/users.interface';
import { UserProfile } from 'src/v1/modules/users/dtos/userProfile';
import { UsersService } from 'src/v1/modules/users/services/users.service';
import { UsersProfileService } from 'src/v1/modules/users/services/userProfile.service';
describe('RefreshJwtStrategy', () => {
  let strategy: RefreshJwtStrategy;
  const users = [
    {
      id: '1',
      firstName: 'joe',
      lastName: 'joe joe',
    },
  ];
  const mockAuthService = {
    validateUser: jest.fn(),
  };
  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };
  const mockUsersService = {
    findOneUserById: jest.fn().mockImplementation((id) => {
      const userFound = users.find((item) => item.id === id);
      if (!userFound) {
        return null;
      }
      const user = new User();
      user.id = id;
      return user;
    }),
  };
  const mockUsersProfileService = {
    getUserProfile: jest.fn().mockImplementation((id) => {
      const userProfile = new UserProfile();
      userProfile.id = id;
      return userProfile;
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshJwtStrategy,
        { provide: 'AUTH_SERVICE', useValue: mockAuthService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: 'USERS_SERVICE', useValue: mockUsersService },
        { provide: 'USERS_PROFILE_SERVICE', useValue: mockUsersProfileService },
      ],
    }).compile();

    strategy = module.get<RefreshJwtStrategy>(RefreshJwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return a user profile when a valid JWT token is provided', async () => {
      const mockPayload = {
        id: '1',
        iat: Date.now(),
        exp: Math.floor(Date.now() / 1000) + 10000,
        isVerified: true,
      };
      mockAuthService.validateUser.mockReturnValue({ userId: 1, username: 'user1' });
      const user = await strategy.validate(mockPayload);
      expect(user).toBeInstanceOf(UserProfile);
      expect(user.id).toEqual(mockPayload.id);
    });
    it('should return an error when an expired JWT Token is provided', async () => {
      const nowInSeconds = Math.floor(Date.now() / 1000); // Get the current time in seconds
      const mockPayload = {
        id: '1',
        iat: nowInSeconds,
        exp: nowInSeconds - 10000,
        isVerified: true,
      };
      mockAuthService.validateUser.mockReturnValue({ userId: 1, username: 'user1' });
      await expect(strategy.validate(mockPayload)).rejects.toThrow();
    });
    it('should throw an error if the user id in the sub doesnt exist in the database', async () => {
      const nowInSeconds = Math.floor(Date.now() / 1000); // Get the current time in seconds
      const mockPayload = {
        id: '93',
        iat: nowInSeconds,
        exp: nowInSeconds - 10000,
        isVerified: true,
      };
      mockAuthService.validateUser.mockReturnValue({ userId: 1, username: 'user1' });
      await expect(strategy.validate(mockPayload)).rejects.toThrow();
    });
  });
});
