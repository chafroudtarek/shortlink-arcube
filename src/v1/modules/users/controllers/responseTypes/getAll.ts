import { ApiProperty } from '@nestjs/swagger';
import { IUser } from '../../users.interface';
import { ApiUser } from './apiUser';
import { PaginatedResponse } from 'src/v1/modules/shared/responses/successResponses/paginatedResponse';
import { GenericResponse } from 'src/v1/modules/shared/responses/successResponses/genericResponse';
import { IPaginationReturn } from 'src/v1/modules/shared/paginator/paginator.interface';

class PaginatedUsersResponse extends PaginatedResponse<IUser[]> {}

export class PaginatedUsers extends PaginatedUsersResponse {
  @ApiProperty({
    type: [ApiUser],
  })
  payload: ApiUser[];
}

export class GetAllUsersResponse extends GenericResponse<IPaginationReturn<IUser[]>> {
  @ApiProperty()
  message: string;
  @ApiProperty({
    type: PaginatedUsers,
  })
  payload: PaginatedUsers;
}
