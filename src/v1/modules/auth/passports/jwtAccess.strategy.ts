import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import 'dotenv/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IJWTAcessPayload } from '../dtos/jwtTypes';
import { JWT_CONFIG } from 'src/v1/config';
@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONFIG.secretKey,
    });
  }

  async validate(payload: IJWTAcessPayload): Promise<{ id: string }> {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < currentTimeInSeconds;
    if (isExpired) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Please Login First',
        error: 'Unauthorized',
      });
    }
    return { id: payload.id };
  }
}
