import { ApiProperty } from '@nestjs/swagger';
import { GenericResponse } from 'src/v1/modules/shared/responses/successResponses/genericResponse';

export class RequestAccountEmailVerificationResponse extends GenericResponse<string> {
  @ApiProperty({
    type: 'string',
  })
  payload: string;
}
