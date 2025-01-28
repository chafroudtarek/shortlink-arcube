import { ApiProperty } from '@nestjs/swagger';
import { IUser } from '../../users.interface';
import { ApiUser } from './apiUser';
import { GenericResponse } from 'src/v1/modules/shared/responses/successResponses/genericResponse';

export class CreateUserResponse extends GenericResponse<IUser> {
  @ApiProperty({
    type: ApiUser,
  })
  payload: ApiUser;
}
