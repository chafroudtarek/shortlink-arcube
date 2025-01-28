import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { IUsersService } from '../services/users.service';
import { Request } from 'express';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllUsersResponse } from './responseTypes/getAll';
import { USERS_SERVICE_PROVIDER_NAME } from '../providers.constants';
import { AccessJwtGuard } from '../../auth/guards/jwtAuthAccess.guard';
import { MONGO_QUERY_PARSER_PROVIDER_NAME } from '../../shared/providers.constants';
import { IQueryParser } from '../../shared/queryParser/queryParser.interface';
import { ApiGenericInternalServerErrorResponse } from '../../shared/responses/decorators/apiInternalserver.decorator';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';

@ApiTags('Users')
@UseGuards(AccessJwtGuard)
@Controller({
  path: 'api/users',
  version: '1',
})
export class GetUsersController {
  constructor(
    @Inject(USERS_SERVICE_PROVIDER_NAME) private readonly _usersService: IUsersService,
    @Inject(MONGO_QUERY_PARSER_PROVIDER_NAME) private readonly _queryParser: IQueryParser,
  ) {}
  @ApiOperation({
    summary: 'Get All User',
  })
  @ApiOkResponse({
    status: 201,
    description: 'Success',
    type: GetAllUsersResponse,
  })
  @ApiGenericInternalServerErrorResponse()
  @Get()
  @Permissions('getUsers')
  @UseGuards(PermissionsGuard)
  async getUsers(@Req() req: Request) {
    return await this._usersService.getAll(req.queryObject);
  }
}
