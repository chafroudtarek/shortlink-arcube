import { IRole } from '../../roles.interface';
import { ApiProperty } from '@nestjs/swagger';
import { ApiRole } from './apiRole';
import { GenericResponse } from 'src/v1/modules/shared/responses/successResponses/genericResponse';

export class GetRoleByIdResponse extends GenericResponse<IRole> {
  @ApiProperty()
  message: string;
  @ApiProperty({
    type: ApiRole,
  })
  payload: ApiRole;
}
