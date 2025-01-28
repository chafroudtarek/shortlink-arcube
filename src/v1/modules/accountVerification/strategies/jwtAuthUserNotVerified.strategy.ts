import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import 'dotenv/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT_CONFIG } from 'src/v1/config';
import { IJWTAcessPayload } from '../../auth/dtos/jwtTypes';
import { IRequestUser } from '../../users/users.interface';
import { USER_NOT_VERIFIED_JWT_STRATEGY_NAME } from '../providers.constants';
@Injectable()
export class UserNotVerifiedAccessJwtStrategy extends PassportStrategy(
  Strategy,
  USER_NOT_VERIFIED_JWT_STRATEGY_NAME,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONFIG.secretKey,
    });
  }

  validate(payload: IJWTAcessPayload): IRequestUser {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < currentTimeInSeconds;
    if (isExpired) {
      throw new UnauthorizedException({
        statusCode: 403,
        message: 'Please Login First',
        error: 'Unauthorized',
      });
    }
    if (payload.isVerified === true) {
      throw new UnauthorizedException({
        statusCode: 403,
        message: 'Your account is already verified',
        error: 'Unauthorized',
      });
    }
    return {
      id: payload?.id || undefined,
      isVerified: payload.isVerified || false,
    };
  }
}
