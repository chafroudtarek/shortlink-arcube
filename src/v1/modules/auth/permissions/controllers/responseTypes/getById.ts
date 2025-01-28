import { ApiProperty } from '@nestjs/swagger';
import { IPermission } from '../../permissions.interface';
import { ApiPermission } from './apiPermission';
import { GenericResponse } from 'src/v1/modules/shared/responses/successResponses/genericResponse';

export class GetPermissionByIdResponse extends GenericResponse<IPermission> {
  @ApiProperty()
  message: string;
  @ApiProperty({
    type: ApiPermission,
  })
  payload: ApiPermission;
}
