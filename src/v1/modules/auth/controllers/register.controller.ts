import { Controller, Request, Post, Body, Injectable, Inject } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { RegisterUserBody } from '../validations/registerUserBody';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { IAuthService } from '../services/auth.service';
import { ApiGenericInternalServerErrorResponse } from 'src/v1/modules/shared/responses/decorators/apiInternalserver.decorator';
import { RegisterResponse } from './responseTypes/register';
import { AUTH_SERVICE_PROVIDER_NAME } from '../providers.constants';

@Injectable()
@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class RegisterController {
  constructor(@Inject(AUTH_SERVICE_PROVIDER_NAME) private _authService: IAuthService) {}
  @ApiOperation({
    summary: 'Register New User Account',
  })
  @ApiCreatedResponse({
    status: 201,
    description: 'Successfully Created Account',
    type: RegisterResponse,
  })
  @ApiResponse({ status: 400, description: 'Validation Error.' })
  @ApiGenericInternalServerErrorResponse()
  @Post('register')
  async register(@Request() _req: ExpressRequest, @Body() userInfo: RegisterUserBody) {
    const createdUser = await this._authService.registerUser(userInfo);
    return {
      message: 'Account Created Successfully',
      payload: createdUser,
    };
  }
}
