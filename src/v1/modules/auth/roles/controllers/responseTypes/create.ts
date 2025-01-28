import { IRole } from '../../roles.interface';
import { ApiProperty } from '@nestjs/swagger';
import { ApiRole } from './apiRole';
import { GenericResponse } from 'src/v1/modules/shared/responses/successResponses/genericResponse';

export class CreateRoleResponse extends GenericResponse<IRole> {
  message: string;
  @ApiProperty({
    type: ApiRole,
  })
  payload: ApiRole;
}
