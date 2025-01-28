import { ApiProperty } from '@nestjs/swagger';
import { IUserProfile } from '../users.interface';
export class UserProfile implements IUserProfile {
  @ApiProperty()
  id: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  fullName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  age: number;
  @ApiProperty()
  birthDate: Date;
  @ApiProperty()
  username: string;
}
