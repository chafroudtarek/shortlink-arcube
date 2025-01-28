import { ApiProperty } from '@nestjs/swagger';
import { UserProfile } from 'src/v1/modules/users/dtos/userProfile';
import { IUser } from 'src/v1/modules/users/users.interface';

export class LoginResponsePayload {
  @ApiProperty({
    type: UserProfile,
  })
  user: IUser;
  @ApiProperty()
  accessToken: string;
}
export class LoginResponse {
  @ApiProperty()
  message: string;
  @ApiProperty({
    type: LoginResponsePayload,
  })
  payload: LoginResponsePayload;
}
