import { Body, Controller, Inject, Post, Request, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LOGGER_PROVIDER_NAME } from '../../core/providers.constants';
import { ILogger } from '../../core/logger/logger.interface';
import { ACCOUNT_EMAIL_VERIFICATION_SERVICE_PROVIDER_NAME } from '../providers.constants';
import { IAccountEmailVerificationService } from '../services/accountEmailVerification.service';
import { VerifyAccountByEmailResponse } from './responseTypes/verifyAccountByEmail.response';
import { UnauthorizedResponse } from '../../shared/responses/errorResponses/unauthorized';
import { ApiGenericInternalServerErrorResponse } from '../../shared/responses/decorators/apiInternalserver.decorator';
import { UserNotVerifiedAccessJwtGuard } from '../guards/jwtAuthUserNotVerified.guard';
import { Request as ExpressRequest, Response } from 'express';
import { VerifyAccountByEmailBody } from '../validations/verifyAccountByEmailBody';
@ApiTags('Verification')
@ApiBearerAuth()
@Controller({
  path: 'auth',
  version: '1',
})
export class VerifyAccountByEmailController {
  constructor(
    @Inject(LOGGER_PROVIDER_NAME) private readonly _logger: ILogger,
    @Inject(ACCOUNT_EMAIL_VERIFICATION_SERVICE_PROVIDER_NAME)
    private readonly _accountEmailVerificationService: IAccountEmailVerificationService,
  ) {}
  @ApiOperation({
    summary: 'Verify Account By Email',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: VerifyAccountByEmailResponse,
  })
  @ApiResponse({
    status: 403,
    description: 'Missing Or Invalid Access Token',
    type: UnauthorizedResponse,
  })
  @ApiGenericInternalServerErrorResponse()
  @UseGuards(UserNotVerifiedAccessJwtGuard)
  @Post('verify-account/email')
  async verifyAccountByEmail(
    @Request() request: ExpressRequest,
    @Body() body: VerifyAccountByEmailBody,
    @Res() res: Response,
  ) {
    const result = await this._accountEmailVerificationService.verifyAccount({
      token: body.token,
      userId: request.user.id,
    });
    res.status(201).json({
      payload: result,
      message: 'Success',
    });
  }
}
