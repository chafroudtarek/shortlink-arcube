import { ApiProperty } from '@nestjs/swagger';
import { ApiRole } from './apiRole';
import { IRole } from '../../roles.interface';
import { PaginatedResponse } from 'src/v1/modules/shared/responses/successResponses/paginatedResponse';
import { GenericResponse } from 'src/v1/modules/shared/responses/successResponses/genericResponse';
import { IPaginationReturn } from 'src/v1/modules/shared/paginator/paginator.interface';

class PaginatedRolesResponse extends PaginatedResponse<IRole[]> {}

export class PaginatedRoles extends PaginatedRolesResponse {
  @ApiProperty({
    type: [ApiRole],
  })
  payload: ApiRole[];
}

export class GetAllRolesResponse extends GenericResponse<IPaginationReturn<IRole[]>> {
  @ApiProperty()
  message: string;
  @ApiProperty({
    type: PaginatedRoles,
  })
  payload: PaginatedRoles;
}
