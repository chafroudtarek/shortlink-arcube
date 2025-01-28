import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { USER_NOT_VERIFIED_JWT_STRATEGY_NAME } from '../providers.constants';

@Injectable()
export class UserNotVerifiedAccessJwtGuard extends AuthGuard(USER_NOT_VERIFIED_JWT_STRATEGY_NAME) {}
