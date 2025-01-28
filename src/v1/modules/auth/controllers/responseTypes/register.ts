import { ApiProperty } from '@nestjs/swagger';
import { UserProfile } from 'src/v1/modules/users/dtos/userProfile';
import { IUserProfile } from 'src/v1/modules/users/users.interface';
import { IGenericResponse } from 'src/types/genericResponse';

export class RegisterResponse implements IGenericResponse<IUserProfile> {
  @ApiProperty()
  message: string;
  @ApiProperty({
    type: UserProfile,
  })
  payload: UserProfile;
}
