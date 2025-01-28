import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AccessJwtStrategy } from '../jwtAccess.strategy';

describe('AccessJwtStrategy', () => {
  let strategy: AccessJwtStrategy;
  const mockAuthService = {
    validateUser: jest.fn(),
  };
  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccessJwtStrategy,
        { provide: 'AUTH_SERVICE', useValue: mockAuthService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    strategy = module.get<AccessJwtStrategy>(AccessJwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return a user object when a valid JWT token is provided', async () => {
      const mockPayload = {
        id: '1',
        iat: Date.now(),
        exp: Math.floor(Date.now() / 1000) + 10000,
        isVerified: true,
      };
      mockAuthService.validateUser.mockReturnValue({ userId: '1', username: 'user1' });
      const user = await strategy.validate(mockPayload);
      expect(user).toEqual({ id: '1' });
    });
    it('should return an error when an expired JWT Token is provided', async () => {
      const nowInSeconds = Math.floor(Date.now() / 1000); // Get the current time in seconds
      const mockPayload = {
        id: '1',
        iat: nowInSeconds,
        exp: nowInSeconds - 10000,
        isVerified: true,
      };
      mockAuthService.validateUser.mockReturnValue({ userId: '1', username: 'user1' });
      await expect(strategy.validate(mockPayload)).rejects.toThrow();
    });
  });
});
