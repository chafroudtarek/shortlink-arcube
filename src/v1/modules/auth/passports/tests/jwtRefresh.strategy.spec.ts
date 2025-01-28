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
    it('should receive a cookie when the constructor is called', async () => {
      const cookie =
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEyLCJpYXQiOjE2ODk5MjY1NjIxMjIsInJ2ZyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6WzcsMjU1LDI2LDE4Niw2MCwyNTNdfSwiZXhwIjoxNjg5OTI2NTYyNDIyfQ.bA59bL0v3zn5jd6iq6ggNNQ5K-yAziRBzBnVGuLe94vD9VwIn7qOl9IKPgHmYHkKRzigFSiRkaRwu9zPeydvrqas12SEkyBJ2q3gwThT3ho_WJ4ST_57akzbgumAxBdEPl8BvFppneBHs-D6PzWreM_nkU1GkDuvR4tb7cw1Q_SV0jkIIvSyFCYJNnLXqrTVHhwCFaShdwQTN2iST9D8KRnxw5lUxJEKwH_XmX7w3uLLGH5KS7tZrWJtUKdDlFnMbL70iAoZR2rpGFtq33gC7K3l5kp0DSlM_YzJjUH4NL9esUE-4Q2fhguYdH60GUH9QZdA9uWhprAqHV7GKAkyAZH9P-PLvnbVu3RO1APszoGOFr5KJgbDpGM5s8v8yJ2g92zB84eZhiVY5TlHLQumqBJncC2tm7M8-sQpf92TNItnsGky3oYzAEsv9D4CHQaiDYNc8L6fkWh4QWaBZDTowwUW6hFongUWeNozd3Wvd5pctDYDHFogrWoPolqATyJn07IX4wvHW6jqsiksNZekX1ydw9B8tZRSz34UZObA5kbg_KAOGkqfLgH532rq-6418bSuehevImM_jxkrT4_ucVdSQUy0Sjt5bVyPZCDItWEwFBeZvmXF8z0m4yY-4HBRCfEBOoe_G0CXREKaLeozv2lq8XjFOuumJW0vyANWnmg';
      const strategy = new RefreshJwtStrategy(
        mockUsersService as unknown as UsersService,
        mockUsersProfileService as unknown as UsersProfileService,
      );
      expect(strategy['_usersService']).toBe(mockUsersService);
      expect(strategy['_userProfileService']).toBe(mockUsersProfileService);
      const mockRequest = {
        cookies: {
          rtkc: cookie,
        },
      };
      const jwtFromRequestResult = strategy['_jwtFromRequest'](mockRequest);
      expect(jwtFromRequestResult).toBe(cookie);
    });
  });
});
