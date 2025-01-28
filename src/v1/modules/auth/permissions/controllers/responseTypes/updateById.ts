import { ApiProperty } from '@nestjs/swagger';
import { GenericResponse } from 'src/v1/modules/shared/responses/successResponses/genericResponse';

export class UpdatePermissionByIdResponse extends GenericResponse<number> {
  @ApiProperty()
  message: string;
  @ApiProperty()
  payload: number;
}
