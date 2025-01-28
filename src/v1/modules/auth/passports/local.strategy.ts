import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthService } from '../services/auth.service';
import { AUTH_SERVICE_PROVIDER_NAME } from '../providers.constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(AUTH_SERVICE_PROVIDER_NAME) private authService: IAuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Please Verify Your Credentials!',
        error: 'Wrong Credentials',
      });
    }
    return user;
  }
}
