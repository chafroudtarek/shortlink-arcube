import { ApiProperty } from '@nestjs/swagger';
import { IPermission } from '../../permissions.interface';
import { ApiPermission } from './apiPermission';
import { PaginatedResponse } from 'src/v1/modules/shared/responses/successResponses/paginatedResponse';
import { GenericResponse } from 'src/v1/modules/shared/responses/successResponses/genericResponse';
import { IPaginationReturn } from 'src/v1/modules/shared/paginator/paginator.interface';

class PaginatedPermissionsResponse extends PaginatedResponse<IPermission[]> {}
export class PaginatedPermissions extends PaginatedPermissionsResponse {
  @ApiProperty({
    type: [ApiPermission],
  })
  payload: ApiPermission[];
}

export class GetAllPermissionsResponse extends GenericResponse<IPaginationReturn<IPermission[]>> {
  @ApiProperty({
    type: PaginatedPermissions,
  })
  payload: PaginatedPermissions;
}
