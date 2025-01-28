import { Controller, Request, UseGuards, Res, Get, Inject } from '@nestjs/common';
import { Request as ExpressRequest, Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccessJwtGuard } from '../guards/jwtAuthAccess.guard';
import { IUsersService } from 'src/v1/modules/users/services/users.service';
import { GetMeResponse } from './responseTypes/getMe';
import { UnauthorizedResponse } from '../../shared/responses/errorResponses/unauthorized';
import { ApiGenericInternalServerErrorResponse } from '../../shared/responses/decorators/apiInternalserver.decorator';
import { USERS_SERVICE_PROVIDER_NAME } from 'src/v1/modules/users/providers.constants';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class GetMeController {
  constructor(@Inject(USERS_SERVICE_PROVIDER_NAME) private _usersService: IUsersService) {}
  @ApiOperation({
    summary: 'Get My Info',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: GetMeResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Missing Or Invalid Access Token',
    type: UnauthorizedResponse,
  })
  @ApiGenericInternalServerErrorResponse()
  @UseGuards(AccessJwtGuard)
  @Get('me')
  async getMe(@Request() req: ExpressRequest, @Res() res: Response) {
    const result = await this._usersService.getOne({
      filter: {
        _id: req.user.id,
      },
    });
    res.status(200).json({
      payload: result,
      message: 'Success',
    });
  }
}
