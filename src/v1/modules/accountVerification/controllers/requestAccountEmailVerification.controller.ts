import { Controller, Inject, Post, Request, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest, Response } from 'express';
import { RequestAccountEmailVerificationResponse } from './responseTypes/requestAccountEmailVerification.response';
import { ILogger } from '../../core/logger/logger.interface';
import { LOGGER_PROVIDER_NAME } from '../../core/providers.constants';
import { UnauthorizedResponse } from '../../shared/responses/errorResponses/unauthorized';
import { ApiGenericInternalServerErrorResponse } from '../../shared/responses/decorators/apiInternalserver.decorator';
import { REQUEST_EMAIL_VERIFICATION_SERVICE_PROVIDER_NAME } from '../providers.constants';
import { IRequestAccountEmailVerificationService } from '../services/requestEmailVerification.service';
import { UserNotVerifiedAccessJwtGuard } from '../guards/jwtAuthUserNotVerified.guard';
@ApiTags('Verification')
@ApiBearerAuth()
@Controller({
  path: 'auth',
  version: '1',
})
export class RequestAccountEmailVerificationController {
  constructor(
    @Inject(LOGGER_PROVIDER_NAME) private readonly _logger: ILogger,
    @Inject(REQUEST_EMAIL_VERIFICATION_SERVICE_PROVIDER_NAME)
    private readonly _requestAccountEmailVerificationService: IRequestAccountEmailVerificationService,
  ) {}
  @ApiOperation({
    summary: 'Request Account Verification By Email',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: RequestAccountEmailVerificationResponse,
  })
  @ApiResponse({
    status: 403,
    description: 'Missing Or Invalid Access Token',
    type: UnauthorizedResponse,
  })
  @ApiGenericInternalServerErrorResponse()
  @UseGuards(UserNotVerifiedAccessJwtGuard)
  @Post('verify-account/request/email')
  async requestAccountEmailVerification(@Request() request: ExpressRequest, @Res() res: Response) {
    const result = await this._requestAccountEmailVerificationService.requestVerification(
      request.user.id,
    );
    res.status(201).json({
      payload: result,
      message: 'Success',
    });
  }
}
