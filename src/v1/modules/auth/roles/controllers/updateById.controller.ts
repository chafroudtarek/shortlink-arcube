import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';
import { IRolesService } from '../services/roles.service';
import { CreateRoleBody } from '../validations/createRoleBody';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateRoleByIdResponse } from './responseTypes/updateById';
import { ROLES_SERVICE_PROVIDER_NAME } from '../../providers.constants';
import { IdValidationPipe } from 'src/v1/modules/shared/pipelines/idValidationPipe.pipe';
import { ApiGenericInternalServerErrorResponse } from 'src/v1/modules/shared/responses/decorators/apiInternalserver.decorator';

@ApiTags('Roles')
@Controller({
  path: 'api/roles',
  version: '1',
})
export class UpdateRoleByIdController {
  constructor(@Inject(ROLES_SERVICE_PROVIDER_NAME) private readonly _rolesService: IRolesService) {}
  @ApiOperation({
    summary: 'Update Role By Id',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Success',
    type: UpdateRoleByIdResponse,
  })
  @ApiGenericInternalServerErrorResponse()
  @Patch('/:id')
  async update(@Param('id', IdValidationPipe) id: string, @Body() body: CreateRoleBody) {
    const result = await this._rolesService.update(
      {
        filter: {
          _id: id,
        },
      },
      body,
    );
    return { message: 'Success', payload: { modifiedCount: result } };
  }
}
