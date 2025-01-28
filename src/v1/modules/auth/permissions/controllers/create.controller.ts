import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { IPermissionsService } from '../services/permissions.service';
import { CreatePermissionBody } from '../validations/createPermissionBody';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePermissionResponse } from './responseTypes/create';
import { PERMISSIONS_SERVICE_PROVIDER_NAME } from '../../providers.constants';
import { ApiGenericInternalServerErrorResponse } from 'src/v1/modules/shared/responses/decorators/apiInternalserver.decorator';
@ApiTags('Permissions')
@Controller({
  path: 'api/permissions',
  version: '1',
})
export class CreatePermissionController {
  constructor(
    @Inject(PERMISSIONS_SERVICE_PROVIDER_NAME)
    private readonly _permissionsService: IPermissionsService,
  ) {}
  @ApiOperation({
    summary: 'Create Permission',
  })
  @ApiCreatedResponse({
    status: 201,
    description: 'Success',
    type: CreatePermissionResponse,
  })
  @ApiGenericInternalServerErrorResponse()
  @Post()
  @HttpCode(201)
  async create(@Body() payload: CreatePermissionBody) {
    const result = await this._permissionsService.create(payload);
    return { message: 'Success', payload: result };
  }
}
