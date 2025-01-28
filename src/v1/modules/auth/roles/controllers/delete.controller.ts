import { Controller, Delete, Inject, Param } from '@nestjs/common';
import { IRolesService } from '../services/roles.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteRoleByIdResponse } from './responseTypes/deleteById';
import { ROLES_SERVICE_PROVIDER_NAME } from '../../providers.constants';
import { ApiGenericInternalServerErrorResponse } from 'src/v1/modules/shared/responses/decorators/apiInternalserver.decorator';
import { IdValidationPipe } from 'src/v1/modules/shared/pipelines/idValidationPipe.pipe';

@ApiTags('Roles')
@Controller({
  path: 'api/roles',
  version: '1',
})
export class DeleteRoleByIdController {
  constructor(@Inject(ROLES_SERVICE_PROVIDER_NAME) private readonly _rolesService: IRolesService) {}
  @ApiOperation({
    summary: 'Delete Role By Id',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Success',
    type: DeleteRoleByIdResponse,
  })
  @ApiGenericInternalServerErrorResponse()
  @Delete('/:id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const result = await this._rolesService.softDeleteOne({
      filter: {
        _id: id,
      },
    });
    return { message: 'Success', payload: { deletedCount: result } };
  }
}
