import { ApiProperty } from '@nestjs/swagger';
import { ErrorResponse } from './errorResponse';

export class UnauthorizedResponse extends ErrorResponse {
  @ApiProperty({
    default: 401,
  })
  statusCode: number;
}
