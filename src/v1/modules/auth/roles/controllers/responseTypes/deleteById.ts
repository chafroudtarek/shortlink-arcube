import { ApiProperty } from '@nestjs/swagger';
import { GenericResponse } from 'src/v1/modules/shared/responses/successResponses/genericResponse';

export class DeleteRoleByIdResponse extends GenericResponse<number> {
  @ApiProperty()
  message: string;
  @ApiProperty()
  payload: number;
}
