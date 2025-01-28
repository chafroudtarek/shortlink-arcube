import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponse {
  @ApiProperty({
    default: 'Success',
  })
  message: string;
  @ApiProperty({
    default: {},
  })
  payload: object;
}
