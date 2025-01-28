import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  USERS_PROFILE_SERVICE_PROVIDER_NAME,
  USERS_SERVICE_PROVIDER_NAME,
} from '../../users/providers.constants';
import { USERS_REPO_PROVIDER_NAME } from '../../database/providers.constants';
import { IUsersProfileService } from '../../users/services/userProfile.service';
import { IUsersRepository } from '../../database/repositories/user.repository';
import { IUsersService } from '../../users/services/users.service';
import { UserProfile } from '../../users/dtos/userProfile';
import { IJWTAcessPayload, IJWTRefreshPayload, IUserJWTTokens } from '../dtos/jwtTypes';
import { IUser, IUserProfile } from '../../users/users.interface';
import { JWT_CONFIG } from 'src/v1/config';
import { RegisterUserBody } from '../validations/registerUserBody';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(USERS_SERVICE_PROVIDER_NAME) private _usersService: IUsersService,
    @Inject(USERS_REPO_PROVIDER_NAME) private _usersRepo: IUsersRepository,
    @Inject(USERS_PROFILE_SERVICE_PROVIDER_NAME)
    private _userProfileService: IUsersProfileService,
    private _jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<UserProfile | null> {
    const user = await this._usersService.getOne({
      filter: {
        $or: [{ username: username }, { email: username }],
      },
    });
    if (!user) {
      return null;
    }
    const userPassword = await this._usersRepo.getUserPassword(user.id);
    if (user && (await user.isCorrectPassword(pass, userPassword))) {
      delete user.password;
      const userProfile = await this._userProfileService.getUserProfile(user?.id);
      return userProfile;
    }
    return null;
  }

  async login(user: Omit<IUser, 'password'>): Promise<IUserJWTTokens> {
    const data = await this.createUserJwtTokens(user);
    return data;
  }
  async refreshTokens(user: Omit<IUser, 'password'>): Promise<IUserJWTTokens> {
    const data = await this.createUserJwtTokens(user);
    return data;
  }
  private async createUserJwtTokens(user: Omit<IUser, 'password'>): Promise<IUserJWTTokens> {
    const accessPayload: IJWTAcessPayload = {
      id: user.id,
      iat: Math.floor(Date.now() / 1000),
      isVerified: user.isVerified,
    };
    const refreshPayload: IJWTRefreshPayload = {
      id: user.id,
      iat: Math.floor(Date.now() / 1000),
      isVerified: user.isVerified,
    };
    const accessToken = await this._jwtService.signAsync(accessPayload, {
      algorithm: 'RS256',
      expiresIn: JWT_CONFIG.accessExpiresIn,
    });
    const refreshToken = await this._jwtService.signAsync(refreshPayload, {
      algorithm: 'RS256',
      expiresIn: JWT_CONFIG.refreshExpiresIn,
    });
    return { accessToken, refreshToken };
  }
  async registerUser(userInfo: RegisterUserBody): Promise<IUserProfile> {
    const createdUser = (await this._usersService.createUser(userInfo)) as IUserProfile;
    return createdUser;
  }
}
export interface IAuthService {
  validateUser(username: string, pass: string): Promise<UserProfile | null>;
  login(user: Omit<IUser, 'password'>): Promise<IUserJWTTokens>;
  refreshTokens(user: Omit<IUser, 'password'>): Promise<IUserJWTTokens>;
  registerUser(user: RegisterUserBody): Promise<IUserProfile>;
}

export const AuthServiceProvider = [
  {
    provide: 'AUTH_SERVICE',
    useClass: AuthService,
  },
];
