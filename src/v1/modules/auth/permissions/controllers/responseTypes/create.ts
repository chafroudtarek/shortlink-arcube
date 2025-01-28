import { ApiProperty } from '@nestjs/swagger';
import { ApiPermission } from './apiPermission';
import { IPermission } from '../../permissions.interface';
import { GenericResponse } from 'src/v1/modules/shared/responses/successResponses/genericResponse';

export class CreatePermissionResponse extends GenericResponse<IPermission> {
  @ApiProperty({
    type: ApiPermission,
  })
  payload: ApiPermission;
}
