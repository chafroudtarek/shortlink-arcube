import { Controller, Request, Post, UseGuards, Res, Inject } from '@nestjs/common';
import { Request as ExpressRequest, Response } from 'express';
import { LocalAuthGuard } from '../guards/localAuth.guard';
import { IAuthService } from '../services/auth.service';
import { LoginUserBody } from '../validations/loginUserBody';
import { ApiBody, ApiTags, ApiOperation, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { LoginResponse } from './responseTypes/login';
import { JWT_CONFIG } from 'src/v1/config';
import { ApiGenericInternalServerErrorResponse } from '../../shared/responses/decorators/apiInternalserver.decorator';
import { AUTH_SERVICE_PROVIDER_NAME } from '../providers.constants';
import { IUser } from '../../users/users.interface';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class LoginController {
  constructor(@Inject(AUTH_SERVICE_PROVIDER_NAME) private _authService: IAuthService) {}
  @ApiOperation({
    summary: 'Login User',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Success',
    type: LoginResponse,
  })
  @ApiResponse({ status: 401, description: 'Wrong Credentials.' })
  @ApiResponse({ status: 400, description: 'Validation Error.' })
  @ApiGenericInternalServerErrorResponse()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginUserBody })
  async login(@Request() req: ExpressRequest, @Res() res: Response) {
    const { accessToken, refreshToken } = await this._authService.login(req.user as IUser);
    res.cookie(JWT_CONFIG.refreshCookieName, refreshToken, {
      sameSite: true,
      httpOnly: true,
    });
    res.status(200).json({
      message: 'Login Successfull',
      payload: { user: req.user, accessToken: accessToken, refreshToken: refreshToken },
    });
  }
}
