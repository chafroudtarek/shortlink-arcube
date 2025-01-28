import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Request } from 'express';
import { IUsersService } from 'src/v1/modules/users/services/users.service';
import { IJWTRefreshPayload } from '../dtos/jwtTypes';
import { JWT_CONFIG } from 'src/v1/config';
import { IUser } from 'src/v1/modules/users/users.interface';
import { IUsersProfileService } from 'src/v1/modules/users/services/userProfile.service';
import {
  USERS_PROFILE_SERVICE_PROVIDER_NAME,
  USERS_SERVICE_PROVIDER_NAME,
} from 'src/v1/modules/users/providers.constants';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'RefreshJwtStrategy') {
  constructor(
    @Inject(USERS_SERVICE_PROVIDER_NAME) private _usersService: IUsersService,
    @Inject(USERS_PROFILE_SERVICE_PROVIDER_NAME)
    private _userProfileService: IUsersProfileService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          let token = null;
          if (req && req.cookies) {
            token = req.cookies[JWT_CONFIG.refreshCookieName];
          }
          return token;
        },
      ]),
      secretOrKey: JWT_CONFIG.secretKey,
    });
  }

  async validate(payload: IJWTRefreshPayload) {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < currentTimeInSeconds;
    if (!payload || !payload.id || isExpired) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Access Denied',
        error: 'Unauthorized',
      });
    }

    const user: IUser = await this._usersService.findOneUserById(payload.id);

    if (!user) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Access Denied',
        error: 'Unauthorized',
      });
    }

    const userProfile = await this._userProfileService.getUserProfile(user?.id);
    return userProfile;
  }
}
