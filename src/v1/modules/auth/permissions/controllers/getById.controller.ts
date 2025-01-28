import { Controller, Get, Inject, Param } from '@nestjs/common';
import { IPermissionsService } from '../services/permissions.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetPermissionByIdResponse } from './responseTypes/getById';
import { PERMISSIONS_SERVICE_PROVIDER_NAME } from '../../providers.constants';
import { IdValidationPipe } from 'src/v1/modules/shared/pipelines/idValidationPipe.pipe';
import { ApiGenericInternalServerErrorResponse } from 'src/v1/modules/shared/responses/decorators/apiInternalserver.decorator';

@ApiTags('Permissions')
@Controller({
  path: 'api/permissions',
  version: '1',
})
export class GetPermissionByIdController {
  constructor(
    @Inject(PERMISSIONS_SERVICE_PROVIDER_NAME)
    private readonly _permissionsService: IPermissionsService,
  ) {}
  @ApiOperation({
    summary: 'Get Permission By Id',
  })
  @ApiOkResponse({
    status: 200,
    description: 'Success',
    type: GetPermissionByIdResponse,
  })
  @ApiGenericInternalServerErrorResponse()
  @Get('/:id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const result = await this._permissionsService.getOne({
      filter: {
        _id: id,
      },
    });
    return { message: 'Success', payload: result };
  }
}
