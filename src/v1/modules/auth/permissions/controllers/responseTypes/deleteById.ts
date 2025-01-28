import { ApiProperty } from '@nestjs/swagger';
import { GenericResponse } from 'src/v1/modules/shared/responses/successResponses/genericResponse';

export class DeletePermissionByIdResponse extends GenericResponse<number> {
  @ApiProperty()
  payload: number;
}
