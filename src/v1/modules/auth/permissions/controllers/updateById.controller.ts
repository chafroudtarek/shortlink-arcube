import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';
import { IPermissionsService } from '../services/permissions.service';
import { CreatePermissionBody } from '../validations/createPermissionBody';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdatePermissionByIdResponse } from './responseTypes/updateById';
import { PERMISSIONS_SERVICE_PROVIDER_NAME } from '../../providers.constants';
import { IdValidationPipe } from 'src/v1/modules/shared/pipelines/idValidationPipe.pipe';
import { ApiGenericInternalServerErrorResponse } from 'src/v1/modules/shared/responses/decorators/apiInternalserver.decorator';
@ApiTags('Permissions')
@Controller({
  path: 'api/permissions',
  version: '1',
})
export class UpdatePermissionByIdController {
  constructor(
    @Inject(PERMISSIONS_SERVICE_PROVIDER_NAME)
    private readonly _permissionsService: IPermissionsService,
  ) {}
  @ApiOperation({
    summary: 'Update Permission By Id',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Success',
    type: UpdatePermissionByIdResponse,
  })
  @ApiGenericInternalServerErrorResponse()
  @Patch('/:id')
  async update(@Param('id', IdValidationPipe) id: string, @Body() body: CreatePermissionBody) {
    const result = await this._permissionsService.update(
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
