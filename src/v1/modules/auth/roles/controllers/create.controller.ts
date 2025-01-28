import { Body, Controller, HttpCode, Inject, Post, UseGuards } from '@nestjs/common';
import { IRolesService } from '../services/roles.service';
import { CreateRoleBody } from '../validations/createRoleBody';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoleResponse } from './responseTypes/create';
import { ROLES_SERVICE_PROVIDER_NAME } from '../../providers.constants';
import { ApiGenericInternalServerErrorResponse } from 'src/v1/modules/shared/responses/decorators/apiInternalserver.decorator';
import { AccessJwtGuard } from '../../guards/jwtAuthAccess.guard';
import { Permissions } from '../../decorators/permissions.decorator';
import { PermissionsGuard } from '../../guards/permissions.guard';

@ApiTags('Roles')
@UseGuards(AccessJwtGuard)
@Controller({
  path: 'api/roles',
  version: '1',
})
export class CreateRoleController {
  constructor(@Inject(ROLES_SERVICE_PROVIDER_NAME) private readonly _rolesService: IRolesService) {}
  @ApiOperation({
    summary: 'Create Role',
  })
  @ApiCreatedResponse({
    status: 201,
    description: 'Success',
    type: CreateRoleResponse,
  })
  @ApiGenericInternalServerErrorResponse()
  @Permissions('tegvi2', 'tegvi')
  @UseGuards(PermissionsGuard)
  @Post()
  @HttpCode(201)
  async create(@Body() payload: CreateRoleBody) {
    const result = await this._rolesService.create(payload);
    return { message: 'Successfully Created User', payload: result };
  }
}
