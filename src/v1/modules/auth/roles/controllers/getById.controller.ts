import { Controller, Get, Inject, Param } from '@nestjs/common';
import { IRolesService } from '../services/roles.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetRoleByIdResponse } from './responseTypes/getById';
import { ROLES_SERVICE_PROVIDER_NAME } from '../../providers.constants';
import { IdValidationPipe } from 'src/v1/modules/shared/pipelines/idValidationPipe.pipe';
import { ApiGenericInternalServerErrorResponse } from 'src/v1/modules/shared/responses/decorators/apiInternalserver.decorator';

@ApiTags('Roles')
@Controller({
  path: 'api/roles',
  version: '1',
})
export class GetRoleByIdController {
  constructor(@Inject(ROLES_SERVICE_PROVIDER_NAME) private readonly _rolesService: IRolesService) {}
  @ApiOperation({
    summary: 'Get Role By Id',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Success',
    type: GetRoleByIdResponse,
  })
  @ApiGenericInternalServerErrorResponse()
  @Get('/:id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const result = await this._rolesService.getOne({
      filter: {
        _id: id,
      },
    });
    return { message: 'Success', payload: result };
  }
}
