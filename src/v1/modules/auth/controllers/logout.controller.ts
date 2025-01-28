import { Controller, UseGuards, Res, Get } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LogoutResponse } from './responseTypes/logout';
import { JWT_CONFIG } from 'src/v1/config';
import { RefreshJwtGuard } from '../guards/jwtAuthRefresh.guard';
import { ApiGenericInternalServerErrorResponse } from '../../shared/responses/decorators/apiInternalserver.decorator';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller({
  path: 'auth',
  version: '1',
})
export class LogoutController {
  @ApiOperation({
    summary: 'Logout User',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: LogoutResponse,
  })
  @ApiGenericInternalServerErrorResponse()
  @UseGuards(RefreshJwtGuard)
  @Get('logout')
  async logout(@Res() res: Response) {
    res.clearCookie(JWT_CONFIG.refreshCookieName);
    res.status(200).json({
      message: 'Success',
      payload: {},
    });
  }
}
