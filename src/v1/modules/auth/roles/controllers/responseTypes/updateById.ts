import { ApiProperty } from '@nestjs/swagger';
import { GenericResponse } from 'src/v1/modules/shared/responses/successResponses/genericResponse';

export class UpdateRoleByIdResponse extends GenericResponse<number> {
  @ApiProperty()
  message: string;
  @ApiProperty()
  payload: number;
}
