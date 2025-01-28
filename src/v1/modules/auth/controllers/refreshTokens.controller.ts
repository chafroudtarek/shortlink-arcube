import { Controller, Request, UseGuards, Res, Get, Inject } from '@nestjs/common';
import { Request as ExpressRequest, Response } from 'express';
import { IAuthService } from '../services/auth.service';
import { RefreshJwtGuard } from '../guards/jwtAuthRefresh.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoginResponse } from './responseTypes/login';
import { JWT_CONFIG } from 'src/v1/config';
import { AUTH_SERVICE_PROVIDER_NAME } from '../providers.constants';
import { ApiGenericInternalServerErrorResponse } from '../../shared/responses/decorators/apiInternalserver.decorator';
import { IUser } from '../../users/users.interface';
@ApiTags('Auth')
@ApiBearerAuth()
@Controller({
  path: 'auth',
  version: '1',
})
export class RefreshTokensController {
  constructor(@Inject(AUTH_SERVICE_PROVIDER_NAME) private _authService: IAuthService) {}
  @ApiOperation({
    summary: 'Refresh User Tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully Refreshed Tokens',
    type: LoginResponse,
  })
  @ApiResponse({ status: 401, description: 'Missing Or Invalid Refresh Token' })
  @ApiGenericInternalServerErrorResponse()
  @UseGuards(RefreshJwtGuard)
  @Get('refresh')
  async login(@Request() req: ExpressRequest, @Res() res: Response) {
    const { accessToken, refreshToken } = await this._authService.refreshTokens(req.user as IUser);
    res.cookie(JWT_CONFIG.refreshCookieName, refreshToken, {
      sameSite: true,
      httpOnly: true,
    });
    res.status(200).json({
      message: 'Success',
      payload: { user: req.user, accessToken: accessToken },
    });
  }
}
