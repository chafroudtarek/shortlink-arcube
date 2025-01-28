import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponse } from './errorResponse';

export class InternalServerErrorResponse extends ErrorResponse {
  @ApiProperty({
    default: 500,
  })
  statusCode: number;
}
