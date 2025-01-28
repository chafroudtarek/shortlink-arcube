import { Controller, Delete, Inject, Param } from '@nestjs/common';
import { IPermissionsService } from '../services/permissions.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeletePermissionByIdResponse } from './responseTypes/deleteById';
import { PERMISSIONS_SERVICE_PROVIDER_NAME } from '../../providers.constants';
import { ApiGenericInternalServerErrorResponse } from 'src/v1/modules/shared/responses/decorators/apiInternalserver.decorator';
import { IdValidationPipe } from 'src/v1/modules/shared/pipelines/idValidationPipe.pipe';

@ApiTags('Permissions')
@Controller({
  path: 'api/permissions',
  version: '1',
})
export class DeletePermissionByIdController {
  constructor(
    @Inject(PERMISSIONS_SERVICE_PROVIDER_NAME)
    private readonly _permissionsService: IPermissionsService,
  ) {}
  @ApiOperation({
    summary: 'Delete Permission By Id',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Success',
    type: DeletePermissionByIdResponse,
  })
  @ApiGenericInternalServerErrorResponse()
  @Delete('/:id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const result = await this._permissionsService.softDeleteOne({
      filter: {
        _id: id,
      },
    });
    return { message: 'Success', payload: { deletedCount: result } };
  }
}
