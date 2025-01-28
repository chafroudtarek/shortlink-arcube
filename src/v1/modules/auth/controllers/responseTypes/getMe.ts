import { ApiProperty } from '@nestjs/swagger';
import { GenericResponse } from 'src/v1/modules/shared/responses/successResponses/genericResponse';
import { ApiUser } from 'src/v1/modules/users/controllers/responseTypes/apiUser';
import { IUser } from 'src/v1/modules/users/users.interface';
export class GetMeResponse extends GenericResponse<IUser> {
  @ApiProperty({
    type: ApiUser,
  })
  payload: ApiUser;
}
