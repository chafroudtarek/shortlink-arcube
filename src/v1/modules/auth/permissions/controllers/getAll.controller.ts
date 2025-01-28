import { Controller, Get, Inject, Req } from '@nestjs/common';
import { Request } from 'express';
import { IPermissionsService } from '../services/permissions.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllPermissionsResponse } from './responseTypes/getAll';
import { PERMISSIONS_SERVICE_PROVIDER_NAME } from '../../providers.constants';
import { MONGO_QUERY_PARSER_PROVIDER_NAME } from 'src/v1/modules/shared/providers.constants';
import { IQueryParser } from 'src/v1/modules/shared/queryParser/queryParser.interface';
import { ApiGenericInternalServerErrorResponse } from 'src/v1/modules/shared/responses/decorators/apiInternalserver.decorator';

@ApiTags('Permissions')
@Controller({
  path: 'api/permissions',
  version: '1',
})
export class GetPermissionsController {
  constructor(
    @Inject(PERMISSIONS_SERVICE_PROVIDER_NAME)
    private readonly _permissionsService: IPermissionsService,
    @Inject(MONGO_QUERY_PARSER_PROVIDER_NAME) private readonly _queryParser: IQueryParser,
  ) {}
  @ApiOperation({
    summary: 'Get All Permissions',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Success',
    type: GetAllPermissionsResponse,
  })
  @ApiGenericInternalServerErrorResponse()
  @Get()
  async get(@Req() req: Request) {
    const result = await this._permissionsService.getAll(req.queryObject);
    return { message: 'Success', payload: result };
  }
}
