import { Controller, Get, Inject, Req } from '@nestjs/common';
import { Request } from 'express';
import { IRolesService } from '../services/roles.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllRolesResponse } from './responseTypes/getAll';
import { ROLES_SERVICE_PROVIDER_NAME } from '../../providers.constants';
import { IQueryParser } from 'src/v1/modules/shared/queryParser/queryParser.interface';
import { ApiGenericInternalServerErrorResponse } from 'src/v1/modules/shared/responses/decorators/apiInternalserver.decorator';
import { MONGO_QUERY_PARSER_PROVIDER_NAME } from 'src/v1/modules/shared/providers.constants';

@ApiTags('Roles')
@Controller({
  path: 'api/roles',
  version: '1',
})
export class GetRolesController {
  constructor(
    @Inject(ROLES_SERVICE_PROVIDER_NAME) private readonly _rolesService: IRolesService,
    @Inject(MONGO_QUERY_PARSER_PROVIDER_NAME) private readonly _queryParser: IQueryParser,
  ) {}
  @ApiOperation({
    summary: 'Get Roles',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Success',
    type: GetAllRolesResponse,
  })
  @ApiGenericInternalServerErrorResponse()
  @Get()
  async get(@Req() req: Request) {
    const result = await this._rolesService.getAll(req.queryObject);
    return { message: 'Success', payload: result };
  }
}
